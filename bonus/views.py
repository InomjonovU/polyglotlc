from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import BonusReward, BonusRequest, ReferralHistory
from .serializers import (
    BonusRewardSerializer, BonusRequestSerializer, ReferralHistorySerializer
)


class BonusRewardViewSet(viewsets.ModelViewSet):
    queryset = BonusReward.objects.filter(is_active=True)
    serializer_class = BonusRewardSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]


class BonusRequestViewSet(viewsets.ModelViewSet):
    serializer_class = BonusRequestSerializer

    def get_queryset(self):
        if self.request.user.is_staff:
            return BonusRequest.objects.all()
        return BonusRequest.objects.filter(user=self.request.user)

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        reward = serializer.validated_data['reward']
        user = self.request.user

        if user.bonus_points < reward.points_required:
            raise serializers.ValidationError({"error": "Yetarli ball mavjud emas"})

        serializer.save(user=user)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        bonus_request = self.get_object()
        user = bonus_request.user

        if user.bonus_points < bonus_request.reward.points_required:
            return Response(
                {"error": "Foydalanuvchida yetarli ball yo'q"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.bonus_points -= bonus_request.reward.points_required
        user.save()
        bonus_request.status = 'approved'
        bonus_request.save()
        return Response({"message": "Tasdiqlandi"})

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        bonus_request = self.get_object()
        bonus_request.status = 'rejected'
        bonus_request.save()
        return Response({"message": "Rad etildi"})


class ReferralHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ReferralHistorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return ReferralHistory.objects.all()
        return ReferralHistory.objects.filter(referrer=self.request.user)
