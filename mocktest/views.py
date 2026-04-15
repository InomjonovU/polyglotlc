from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import MockApplication
from .serializers import MockApplicationSerializer


class MockApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = MockApplicationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['test_type', 'status']

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def get_queryset(self):
        return MockApplication.objects.all()
