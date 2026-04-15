from rest_framework import serializers
from .models import BlogPost, Comment, BlogImage


class CommentSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'user_name', 'text', 'created_at']
        read_only_fields = ['user']


class BlogPostSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    author_name = serializers.CharField(source='author.get_full_name', read_only=True)
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = ['id', 'title', 'slug', 'category', 'category_display',
                  'content', 'author', 'author_name', 'status', 'image',
                  'reading_time', 'comments_count', 'created_at']
        read_only_fields = ['slug', 'author']

    def get_comments_count(self, obj):
        return obj.comments.count()


class BlogImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogImage
        fields = ['id', 'image', 'caption', 'order']


class BlogPostDetailSerializer(BlogPostSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    images = BlogImageSerializer(many=True, read_only=True)

    class Meta(BlogPostSerializer.Meta):
        fields = BlogPostSerializer.Meta.fields + ['comments', 'images', 'updated_at']
