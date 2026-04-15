from django.contrib import admin
from .models import Course, CourseApplication
from .teachers import Teacher, Certificate

admin.site.register(Course)
admin.site.register(CourseApplication)
admin.site.register(Teacher)
admin.site.register(Certificate)
