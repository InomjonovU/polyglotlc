from rest_framework import serializers
from .models import Course, CourseApplication
from .teachers import Teacher, Certificate


class CourseSerializer(serializers.ModelSerializer):
    direction_display = serializers.CharField(source='get_direction_display', read_only=True)

    class Meta:
        model = Course
        fields = '__all__'


class CourseApplicationSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)

    class Meta:
        model = CourseApplication
        fields = '__all__'
        read_only_fields = ['status']


class TeacherSerializer(serializers.ModelSerializer):
    direction_display = serializers.CharField(source='get_direction_display', read_only=True)
    certificates_list = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = '__all__'

    def get_certificates_list(self, obj):
        if obj.certificates:
            return [c.strip() for c in obj.certificates.split(',')]
        return []


class CertificateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Certificate
        fields = '__all__'
