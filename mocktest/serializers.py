from rest_framework import serializers
from .models import MockApplication


class MockApplicationSerializer(serializers.ModelSerializer):
    test_type_display = serializers.CharField(source='get_test_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = MockApplication
        fields = '__all__'
        read_only_fields = ['status']
