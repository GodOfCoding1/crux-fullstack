from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import Resume_Match_ViewSet,ResumeViewSet,JobViewSet

router = DefaultRouter()
router.register(r'resume', ResumeViewSet, basename='resume')
router.register(r'job', JobViewSet, basename=' job relation')
router.register(r'match_making', Resume_Match_ViewSet, basename=' job relation')

  
urlpatterns = [
    path(r'', include(router.urls)),
]