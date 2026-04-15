from django.db import models


def determine_level(score_percent):
    if score_percent >= 91:
        return 'C2'
    elif score_percent >= 76:
        return 'C1'
    elif score_percent >= 61:
        return 'B2'
    elif score_percent >= 41:
        return 'B1'
    elif score_percent >= 21:
        return 'A2'
    return 'A1'


LEVEL_DESCRIPTIONS = {
    'A1': 'Beginner — Boshlang\'ich',
    'A2': 'Elementary — Elementar',
    'B1': 'Intermediate — O\'rta',
    'B2': 'Upper-Intermediate — Yuqori o\'rta',
    'C1': 'Advanced — Ilg\'or',
    'C2': 'Proficiency — Professional',
}


class LevelTest(models.Model):
    title = models.CharField(max_length=300)
    description = models.TextField(blank=True, default='')
    time_limit = models.PositiveIntegerField(help_text="Daqiqalarda")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class Question(models.Model):
    ANSWER_CHOICES = [('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D')]

    test = models.ForeignKey(LevelTest, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct = models.CharField(max_length=1, choices=ANSWER_CHOICES)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'id']

    def __str__(self):
        return f"Q{self.order}: {self.text[:50]}"


class TestResult(models.Model):
    test = models.ForeignKey(LevelTest, on_delete=models.CASCADE, related_name='results')
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    total_questions = models.PositiveIntegerField()
    correct_answers = models.PositiveIntegerField()
    score = models.PositiveIntegerField(help_text="Foiz")
    level = models.CharField(max_length=2)
    time_spent = models.PositiveIntegerField(help_text="Soniyalarda", default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} — {self.level} ({self.score}%)"
