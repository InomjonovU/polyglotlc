from rest_framework import serializers
from .models import LevelTest, Question, TestResult, determine_level, LEVEL_DESCRIPTIONS


class QuestionSerializer(serializers.ModelSerializer):
    """Admin uchun — correct javob ko'rinadi"""
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'correct', 'order']


class QuestionPublicSerializer(serializers.ModelSerializer):
    """Foydalanuvchi uchun — correct javob yashiriladi"""
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'order']


class LevelTestListSerializer(serializers.ModelSerializer):
    questions_count = serializers.SerializerMethodField()

    class Meta:
        model = LevelTest
        fields = ['id', 'title', 'description', 'time_limit', 'is_active', 'questions_count', 'created_at']

    def get_questions_count(self, obj):
        return obj.questions.count()


class LevelTestDetailSerializer(serializers.ModelSerializer):
    """Test + savollar (foydalanuvchi uchun, correct yashirin)"""
    questions = QuestionPublicSerializer(many=True, read_only=True)

    class Meta:
        model = LevelTest
        fields = ['id', 'title', 'description', 'time_limit', 'is_active', 'questions', 'created_at']


class LevelTestAdminSerializer(serializers.ModelSerializer):
    """Admin uchun — savollar bilan, correct ko'rinadi"""
    questions = QuestionSerializer(many=True, read_only=True)
    questions_count = serializers.SerializerMethodField()
    results_count = serializers.SerializerMethodField()

    class Meta:
        model = LevelTest
        fields = ['id', 'title', 'description', 'time_limit', 'is_active',
                  'questions', 'questions_count', 'results_count', 'created_at']

    def get_questions_count(self, obj):
        return obj.questions.count()

    def get_results_count(self, obj):
        return obj.results.count()


class SubmitAnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer = serializers.CharField(max_length=1)


class SubmitTestSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    phone = serializers.CharField(max_length=20)
    answers = SubmitAnswerSerializer(many=True)
    time_spent = serializers.IntegerField(default=0)


class TestResultSerializer(serializers.ModelSerializer):
    test_title = serializers.CharField(source='test.title', read_only=True)
    level_description = serializers.SerializerMethodField()

    class Meta:
        model = TestResult
        fields = ['id', 'test', 'test_title', 'name', 'phone',
                  'total_questions', 'correct_answers', 'score',
                  'level', 'level_description', 'time_spent', 'created_at']

    def get_level_description(self, obj):
        return LEVEL_DESCRIPTIONS.get(obj.level, '')
