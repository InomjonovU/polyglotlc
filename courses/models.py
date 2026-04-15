from django.db import models


class Course(models.Model):
    DIRECTION_CHOICES = [
        ('english', 'Ingliz tili'),
        ('math', 'Matematika'),
        ('history', 'Tarix'),
        ('it', 'IT / Dasturlash'),
        ('russian', 'Rus tili'),
        ('other', 'Boshqa'),
    ]
    STATUS_CHOICES = [
        ('published', 'Nashr qilingan'),
        ('draft', 'Draft'),
    ]

    name = models.CharField(max_length=200)
    direction = models.CharField(max_length=20, choices=DIRECTION_CHOICES)
    description = models.TextField()
    price = models.PositiveIntegerField(help_text="Oylik narx (so'm)")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='published')
    image = models.ImageField(upload_to='courses/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class CourseApplication(models.Model):
    STATUS_CHOICES = [
        ('new', 'Yangi'),
        ('viewed', "Ko'rilgan"),
        ('accepted', 'Qabul qilindi'),
    ]

    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='applications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.course.name}"
