from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


class EmailLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        # Try to find user by email
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Also try username = email (for registered users)
            try:
                user = User.objects.get(username=email)
            except User.DoesNotExist:
                raise serializers.ValidationError("Email yoki parol noto'g'ri")

        # Check password
        if not user.check_password(password):
            raise serializers.ValidationError("Email yoki parol noto'g'ri")

        if not user.is_active:
            raise serializers.ValidationError("Foydalanuvchi faol emas")

        # Generate tokens
        refresh = RefreshToken.for_user(user)
        data['tokens'] = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        data['user'] = user
        return data


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True)
    referral_code_input = serializers.CharField(required=False, write_only=True)

    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone',
                  'password', 'password_confirm', 'referral_code_input']

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({"password_confirm": "Parollar mos kelmadi"})
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({"email": "Bu email allaqachon ro'yxatdan o'tgan"})
        return data

    def create(self, validated_data):
        ref_code = validated_data.pop('referral_code_input', None)
        password = validated_data.pop('password')

        user = User(username=validated_data['email'], **validated_data)
        user.set_password(password)

        if ref_code:
            try:
                referrer = User.objects.get(referral_code=ref_code)
                user.referred_by = referrer
            except User.DoesNotExist:
                pass

        user.save()

        if user.referred_by:
            user.referred_by.bonus_points += 100
            user.referred_by.save()
            from bonus.models import ReferralHistory
            ReferralHistory.objects.create(
                referrer=user.referred_by,
                referred=user,
                points_earned=100
            )

        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone',
                  'referral_code', 'bonus_points', 'is_staff']
        read_only_fields = ['referral_code', 'bonus_points', 'is_staff']


class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'email', 'phone',
                  'referral_code', 'bonus_points', 'is_staff', 'is_student', 'date_joined']
        read_only_fields = fields


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(min_length=6)
