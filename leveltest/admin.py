from django.contrib import admin
from .models import LevelTest, Question, TestResult


class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1


@admin.register(LevelTest)
class LevelTestAdmin(admin.ModelAdmin):
    list_display = ['title', 'time_limit', 'is_active', 'created_at']
    inlines = [QuestionInline]


@admin.register(TestResult)
class TestResultAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'level', 'score', 'created_at']
    list_filter = ['level']
