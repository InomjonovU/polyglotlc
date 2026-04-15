from django.db import models
from accounts.models import User


class BonusReward(models.Model):
    name = models.CharField(max_length=200)
    points_required = models.PositiveIntegerField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.points_required} ball)"


class BonusRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Kutilmoqda'),
        ('approved', 'Tasdiqlangan'),
        ('rejected', 'Rad etilgan'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bonus_requests')
    reward = models.ForeignKey(BonusReward, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user} - {self.reward.name}"


class ReferralHistory(models.Model):
    referrer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referral_history')
    referred = models.ForeignKey(User, on_delete=models.CASCADE, related_name='referred_history')
    points_earned = models.PositiveIntegerField(default=100)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.referrer} → {self.referred} (+{self.points_earned})"
