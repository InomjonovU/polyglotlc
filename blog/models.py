from django.db import models
from django.utils.text import slugify
from accounts.models import User


class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ('news', 'Markaz yangiliklari'),
        ('english', 'Ingliz tili'),
        ('it', 'IT'),
        ('math', 'Matematika'),
        ('other', 'Boshqa'),
    ]
    STATUS_CHOICES = [
        ('published', 'Nashr qilingan'),
        ('draft', 'Draft'),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    content = models.TextField(help_text="Rich text HTML content")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    image = models.ImageField(upload_to='blog/', blank=True)
    reading_time = models.PositiveIntegerField(default=5, help_text="O'qish vaqti (daqiqa)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
            if BlogPost.objects.filter(slug=self.slug).exists():
                self.slug = f"{self.slug}-{self.pk or 'new'}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.post.title[:30]}"


class BlogImage(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='blog/images/')
    caption = models.CharField(max_length=300, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.post.title[:30]}"
