
# Create your views here.
from resume.models import Job, Resume, Resume_Match
from resume.serializers import JobSerializer, ResumeSerializer, ResumeMatchSerializer
from rest_framework import viewsets
from django.db import transaction
from rest_framework.response import Response
from rest_framework import status
from time import time
import spacy
import fitz
import os
import re
import json


def allowedExtension(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['docx', 'pdf']


def handle_uploaded_file(f, fileName):
    with open("public/"+fileName, "wb+") as destination:
        for chunk in f.chunks():
            destination.write(chunk)


def normalizeArray(a, length):
    if len(a) > length:
        return a
    res = [0]*length
    for i in range(len(a)):
        res[i] = a[i]
    return res


def getExprience(exps):
    total = []
    for p in exps:
        parts = p.split()
        if "years" in p or "year" in p:
            year = int(parts[0])
            if "months" in p or "month" in p:
                year += int(parts[2]) / 12
        else:
            year = int(parts[0]) / 12
        year = round(year, 2)
        total.append(year)
    return total


print("Loading Resume Model..")
nlp = spacy.load('assets/ResumeModel/output/model-best')
print("Resume Model loaded")


print("Loading Job Description model..")
jd_model = spacy.load('assets/JdModel/output/model-best')
print("Done Job Description model")


class ResumeViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeSerializer
    queryset = Resume.objects.all()

    @transaction.atomic()
    def create(self, request):
        fileName = "resume-"+str(time())+".pdf"
        handle_uploaded_file(request.FILES["file"], fileName)

        doc = fitz.open("public/"+fileName)
        print("Resume taken as input")

        text_of_resume = " "
        for page in doc:
            text_of_resume = text_of_resume + str(page.get_text())

        label_list = []
        text_list = []
        dic = {}
        doc.close()
        os.remove("public/"+fileName)

        doc = nlp(text_of_resume)
        for ent in doc.ents:
            label_list.append(ent.label_)
            text_list.append(ent.text)

        print("Model finished processing")

        for i in range(len(label_list)):
            if label_list[i] in dic:
                dic[label_list[i]].append(text_list[i])
            else:
                dic[label_list[i]] = [text_list[i]]
        resume = Resume.objects.create(json=json.dumps(dic))
        resume.save()

        print("dic", dic)
        # match code below
        job = Job.objects.get(pk=request.data.get("job"))
        jd = json.loads(job.json)
        print("jd", jd)
        jd_skills = set(jd.get('SKILLS', []))
        jd_exprience = jd.get('EXPERIENCE', [])
        jd_post = jd.get('JOBPOST', [])
        jd_post_no = len(jd_post)
        jd_post = [item.lower() for item in jd_post]
        # exp year
        resume_roles = dic.get("WORKED AS", [])
        resume_experience_list = dic.get("YEARS OF EXPERIENCE", [])
        resume_exp_years = normalizeArray(getExprience(
            resume_experience_list), len(resume_roles))
        job_exp_years = normalizeArray(getExprience(jd_exprience), jd_post_no)
        # role vise exprience

        exp_role_resume = {}
        for i in range(len(resume_roles)):
            exp_role_resume[resume_roles[i].lower()] = resume_exp_years[i]
        exp_role_job = {}
        for i in range(jd_post_no):
            exp_role_job[jd_post[i].lower()] = job_exp_years[i]
        roles_matched = 0
        exp_matched = 0

        print("exp_role_resume", exp_role_resume)
        print("exp_role_job", exp_role_job)
        for role in exp_role_job:
            if role not in exp_role_resume:
                continue
            roles_matched += 1
            if exp_role_resume[role] >= exp_role_job[role]:
                exp_matched += 1
            else:
                exp_matched += exp_role_resume[role]/exp_role_job[role]
        exp_precentage = exp_matched/jd_post_no
        role_precentage = roles_matched/jd_post_no
        print("exp_precentage", exp_precentage)
        print("role_precentage", role_precentage)
        # skills
        resume_skills = set(dic.get("SKILLS", []))
        skills_matched = 0
        print("jd_skills", jd_skills)
        print("resume_skills", resume_skills)
        for skill in jd_skills:
            if skill in resume_skills:
                skills_matched += 1
        skills_precentage = skills_matched/len(jd_skills)
        total = role_precentage*20+exp_precentage*30+skills_precentage*50
        Resume_Match.objects.create(resume=resume, job=job, matching=total)

        return Response(status=status.HTTP_201_CREATED, data={"match": total})


class JobViewSet(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    queryset = Job.objects.all()

    @transaction.atomic()
    def create(self, request):
        label_list_jd = []
        text_list_jd = []
        dic_jd = {}

        doc_jd = jd_model(request.data.get("description", ""))
        for ent in doc_jd.ents:
            label_list_jd.append(ent.label_)
            text_list_jd.append(ent.text)

        print("Model work done")

        for i in range(len(label_list_jd)):
            if label_list_jd[i] in dic_jd:
                # if the key already exists, append the new value to the list of values
                dic_jd[label_list_jd[i]].append(text_list_jd[i])
            else:
                # if the key does not exist, create a new key-value pair
                dic_jd[label_list_jd[i]] = [text_list_jd[i]]

        print("Jd dictionary:", dic_jd)
        print("Model work done")

        (Job.objects.create(company=request.data.get("company"),
                            role=request.data.get("role"),
                            description=request.data.get("description"),
                            json=json.dumps(dic_jd))).save()

        return Response(status=status.HTTP_201_CREATED)


class Resume_Match_ViewSet(viewsets.ModelViewSet):
    serializer_class = ResumeMatchSerializer
    queryset = Resume_Match.objects.all()

    def get_queryset(self):
        params = {}
        for key in self.request.query_params:
            params[key] = int(self.request.query_params.get(key)) if self.request.query_params.get(
                key). isdigit() else self.request.query_params.get(key)
        queryset = Resume_Match.objects.filter(**params)
        return queryset
