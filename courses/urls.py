from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('courses', views.CourseViewSet, basename='course')
router.register('applications', views.CourseApplicationViewSet, basename='course-application')
router.register('teachers', views.TeacherViewSet, basename='teacher')
router.register('certificates', views.CertificateViewSet, basename='certificate')

urlpatterns = [
    path('', include(router.urls)),
]
