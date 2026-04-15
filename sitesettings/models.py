from django.db import models


class SiteSettings(models.Model):
    """Singleton model for site-wide settings"""
    # General
    site_name = models.CharField(max_length=200, default='PolyglotLC')
    site_description = models.TextField(default="Professional o'quv markazi", blank=True)
    logo = models.ImageField(upload_to='settings/', blank=True, null=True)

    # Contact
    phone_1 = models.CharField(max_length=20, default='+998 90 123 45 67')
    phone_2 = models.CharField(max_length=20, blank=True, default='')
    email = models.EmailField(default='info@polyglotlc.uz')
    address = models.TextField(default='Toshkent shahri', blank=True)

    # Social media
    telegram = models.URLField(blank=True, default='https://t.me/polyglotlc')
    instagram = models.URLField(blank=True, default='https://instagram.com/polyglotlc')
    youtube = models.URLField(blank=True, default='https://youtube.com/@polyglotlc')
    facebook = models.URLField(blank=True, default='')
    tiktok = models.URLField(blank=True, default='')

    # Working hours
    weekday_hours = models.CharField(max_length=50, default='09:00 - 21:00')
    weekend_hours = models.CharField(max_length=50, default='10:00 - 18:00')
    weekday_label = models.CharField(max_length=50, default='Dushanba - Shanba')
    weekend_label = models.CharField(max_length=50, default='Yakshanba')

    # Hero section
    hero_title = models.CharField(max_length=300, default="Kelajagingizni biz bilan boshlang!", blank=True)
    hero_subtitle = models.TextField(default="Ingliz tili, IT, matematika va boshqa yo'nalishlar bo'yicha professional ta'lim", blank=True)
    hero_image = models.ImageField(upload_to='settings/', blank=True, null=True)

    # Stats
    stats_students = models.CharField(max_length=20, default='300+')
    stats_experience = models.CharField(max_length=20, default='5+')
    stats_teachers = models.CharField(max_length=20, default='30+')
    stats_branches = models.CharField(max_length=20, default='2')

    # Meta
    meta_title = models.CharField(max_length=200, default="PolyglotLC - Professional o'quv markazi", blank=True)
    meta_description = models.TextField(default='', blank=True)

    class Meta:
        verbose_name = 'Site Settings'
        verbose_name_plural = 'Site Settings'

    def __str__(self):
        return self.site_name

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
