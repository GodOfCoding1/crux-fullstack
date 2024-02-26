from django.db import models

# Create your models here.

class Resume(models.Model):
    json = models.JSONField()
    def __str__(self):
        return str(self.pk)
    
class Job(models.Model):
    company = models.CharField(max_length=255)
    role = models.TextField()
    description=models.TextField()
    json = models.JSONField()
    def __str__(self):
        return str(self.pk)

class Resume_Match(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE)
    job= models.ForeignKey(Job, on_delete=models.CASCADE)
    matching= models.TextField()
    def __str__(self):
        return str(self.pk)