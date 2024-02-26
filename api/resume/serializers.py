from rest_framework import serializers
from resume.models import Job, Resume, Resume_Match


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ("__all__")


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = ("__all__")


class ResumeMatchSerializer(serializers.ModelSerializer):

    job = JobSerializer(read_only=True)
    resume = ResumeSerializer(read_only=True)

    class Meta:
        model = Resume_Match
        fields = ("__all__")
