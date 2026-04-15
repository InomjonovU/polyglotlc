from django.db import models


class MockApplication(models.Model):
    TEST_TYPE_CHOICES = [
        ('ielts', 'IELTS Mock'),
        ('cefr', 'CEFR Test'),
    ]
    STATUS_CHOICES = [
        ('new', 'Yangi'),
        ('viewed', "Ko'rilgan"),
        ('called', "Qo'ng'iroq qilindi"),
        ('done', 'Bajarildi'),
    ]

    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    test_type = models.CharField(max_length=10, choices=TEST_TYPE_CHOICES)
    note = models.TextField(blank=True, help_text="Qo'shimcha izoh")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.get_test_type_display()}"
