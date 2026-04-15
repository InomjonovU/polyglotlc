from rest_framework import serializers
from .models import BonusReward, BonusRequest, ReferralHistory


class BonusRewardSerializer(serializers.ModelSerializer):
    class Meta:
        model = BonusReward
        fields = '__all__'


class BonusRequestSerializer(serializers.ModelSerializer):
    reward_name = serializers.CharField(source='reward.name', read_only=True)
    user_name = serializers.CharField(source='user.get_full_name', read_only=True)
    points_required = serializers.IntegerField(source='reward.points_required', read_only=True)

    class Meta:
        model = BonusRequest
        fields = '__all__'
        read_only_fields = ['user', 'status']


class ReferralHistorySerializer(serializers.ModelSerializer):
    referrer_name = serializers.CharField(source='referrer.get_full_name', read_only=True)
    referred_name = serializers.CharField(source='referred.get_full_name', read_only=True)

    class Meta:
        model = ReferralHistory
        fields = '__all__'
