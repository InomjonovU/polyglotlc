from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('posts', views.BlogPostViewSet, basename='blogpost')

urlpatterns = [
    path('', include(router.urls)),
    path('posts/<slug:post_slug>/comments/',
         views.CommentViewSet.as_view({'get': 'list', 'post': 'create'}),
         name='post-comments'),
    path('posts/<slug:post_slug>/images/',
         views.BlogImageViewSet.as_view({'get': 'list', 'post': 'create'}),
         name='post-images'),
    path('posts/<slug:post_slug>/images/<int:pk>/',
         views.BlogImageViewSet.as_view({'get': 'retrieve', 'put': 'update', 'patch': 'partial_update', 'delete': 'destroy'}),
         name='post-image-detail'),
]
