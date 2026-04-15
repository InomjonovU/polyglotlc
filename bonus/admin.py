from django.contrib import admin
from .models import BonusReward, BonusRequest, ReferralHistory

admin.site.register(BonusReward)
admin.site.register(BonusRequest)
admin.site.register(ReferralHistory)
