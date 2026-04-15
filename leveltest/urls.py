from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LevelTestViewSet, QuestionViewSet, TestResultViewSet

router = DefaultRouter()
router.register('tests', LevelTestViewSet, basename='leveltest')
router.register('results', TestResultViewSet, basename='testresult')

urlpatterns = [
    path('', include(router.urls)),
    path('tests/<int:test_pk>/questions/', QuestionViewSet.as_view({
        'get': 'list',
        'post': 'create',
    })),
    path('tests/<int:test_pk>/questions/<int:pk>/', QuestionViewSet.as_view({
        'get': 'retrieve',
        'put': 'update',
        'patch': 'partial_update',
        'delete': 'destroy',
    })),
]
