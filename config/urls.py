from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from accounts.models import User
from courses.models import CourseApplication, Course
from courses.teachers import Teacher
from mocktest.models import MockApplication
from bonus.models import BonusRequest
from branches.models import Branch
from contact.models import ContactMessage
from blog.models import BlogPost


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_stats(request):
    return Response({
        'total_students': User.objects.filter(is_student=True).count(),
        'new_applications_today': CourseApplication.objects.filter(status='new').count(),
        'new_mock_requests': MockApplication.objects.filter(status='new').count(),
        'pending_bonus_requests': BonusRequest.objects.filter(status='pending').count(),
        'total_teachers': Teacher.objects.count() if Teacher else 0,
        'total_courses': Course.objects.filter(status='published').count(),
        'total_blog_posts': BlogPost.objects.filter(status='published').count(),
        'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
    })


urlpatterns = [
    path('django-admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/', include('courses.urls')),
    path('api/blog/', include('blog.urls')),
    path('api/mock/', include('mocktest.urls')),
    path('api/bonus/', include('bonus.urls')),
    path('api/branches/', include('branches.urls')),
    path('api/contact/', include('contact.urls')),
    path('api/admin/stats/', admin_stats, name='admin-stats'),
    path('api/settings/', include('sitesettings.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
