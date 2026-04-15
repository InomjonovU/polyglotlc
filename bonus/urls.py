from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register('rewards', views.BonusRewardViewSet, basename='reward')
router.register('requests', views.BonusRequestViewSet, basename='bonus-request')
router.register('referrals', views.ReferralHistoryViewSet, basename='referral')

urlpatterns = [
    path('', include(router.urls)),
]
