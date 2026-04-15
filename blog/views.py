from rest_framework import viewsets, permissions, filters
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import BlogPost, Comment, BlogImage
from .serializers import BlogPostSerializer, BlogPostDetailSerializer, CommentSerializer, BlogImageSerializer


class BlogPostViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'content']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return BlogPostDetailSerializer
        return BlogPostSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        if self.request.user.is_staff:
            return BlogPost.objects.all()
        return BlogPost.objects.filter(status='published')

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class CommentViewSet(viewsets.ModelViewSet):
    serializer_class = CommentSerializer

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.AllowAny()]
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        return Comment.objects.filter(post__slug=self.kwargs.get('post_slug'))

    def perform_create(self, serializer):
        post = BlogPost.objects.get(slug=self.kwargs['post_slug'])
        serializer.save(user=self.request.user, post=post)


class BlogImageViewSet(viewsets.ModelViewSet):
    serializer_class = BlogImageSerializer
    permission_classes = [permissions.IsAdminUser]
    parser_classes = [MultiPartParser, FormParser]

    def get_queryset(self):
        return BlogImage.objects.filter(post__slug=self.kwargs.get('post_slug'))

    def perform_create(self, serializer):
        post = BlogPost.objects.get(slug=self.kwargs['post_slug'])
        serializer.save(post=post)
