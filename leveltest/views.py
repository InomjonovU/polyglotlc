from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import LevelTest, Question, TestResult, determine_level, LEVEL_DESCRIPTIONS
from .serializers import (
    LevelTestListSerializer, LevelTestDetailSerializer, LevelTestAdminSerializer,
    QuestionSerializer, SubmitTestSerializer, TestResultSerializer,
)


class LevelTestViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_active']

    def get_queryset(self):
        if self.request.user.is_staff:
            return LevelTest.objects.all()
        return LevelTest.objects.filter(is_active=True)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            if self.request.user.is_staff:
                return LevelTestAdminSerializer
            return LevelTestDetailSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return LevelTestListSerializer
        return LevelTestListSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve', 'submit']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def submit(self, request, pk=None):
        test = self.get_object()
        serializer = SubmitTestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        answers = {a['question_id']: a['answer'].upper() for a in data['answers']}

        questions = test.questions.all()
        total = questions.count()
        correct = 0

        for q in questions:
            user_answer = answers.get(q.id)
            if user_answer and user_answer == q.correct:
                correct += 1

        score = round((correct / total) * 100) if total > 0 else 0
        level = determine_level(score)

        result = TestResult.objects.create(
            test=test,
            name=data['name'],
            phone=data['phone'],
            total_questions=total,
            correct_answers=correct,
            score=score,
            level=level,
            time_spent=data.get('time_spent', 0),
        )

        return Response({
            'id': result.id,
            'total_questions': total,
            'correct_answers': correct,
            'score': score,
            'level': level,
            'level_description': LEVEL_DESCRIPTIONS.get(level, ''),
            'time_spent': result.time_spent,
        }, status=status.HTTP_201_CREATED)


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    permission_classes = [permissions.IsAdminUser]

    def get_queryset(self):
        return Question.objects.filter(test_id=self.kwargs.get('test_pk'))

    def perform_create(self, serializer):
        test = LevelTest.objects.get(pk=self.kwargs['test_pk'])
        serializer.save(test=test)


class TestResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = TestResultSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['level']

    def get_queryset(self):
        return TestResult.objects.all()
