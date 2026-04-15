from django.db import models


class Branch(models.Model):
    name = models.CharField(max_length=200)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    working_hours = models.CharField(max_length=100, default="Dush-Shan: 09:00-20:00")

    class Meta:
        verbose_name_plural = 'Branches'

    def __str__(self):
        return self.name
