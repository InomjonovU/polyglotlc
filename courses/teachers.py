from django.db import models


class Teacher(models.Model):
    full_name = models.CharField(max_length=200)
    direction = models.CharField(max_length=20, choices=[
        ('english', 'Ingliz tili'),
        ('math', 'Matematika'),
        ('history', 'Tarix'),
        ('it', 'IT / Dasturlash'),
        ('russian', 'Rus tili'),
        ('other', 'Boshqa'),
    ])
    bio = models.TextField(blank=True)
    photo = models.ImageField(upload_to='teachers/', blank=True)
    experience_years = models.PositiveIntegerField(default=0)
    certificates = models.TextField(blank=True, help_text="Sertifikatlar (vergul bilan)")

    class Meta:
        ordering = ['full_name']

    def __str__(self):
        return self.full_name


class Certificate(models.Model):
    student_name = models.CharField(max_length=200)
    certificate_name = models.CharField(max_length=200)
    score = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to='certificates/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student_name} - {self.certificate_name}"
