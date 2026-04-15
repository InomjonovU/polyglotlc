'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Clock, ChevronRight, ChevronLeft, CheckCircle,
  AlertCircle, Loader2, Trophy, Target, BarChart3, Timer,
  ArrowRight, RotateCcw, Phone, User,
} from 'lucide-react';
import api from '@/lib/api';
import { LevelTest, Question } from '@/types';

const LEVEL_COLORS: Record<string, string> = {
  A1: 'from-red-400 to-red-500',
  A2: 'from-orange-400 to-orange-500',
  B1: 'from-yellow-400 to-yellow-500',
  B2: 'from-green-400 to-green-500',
  C1: 'from-blue-400 to-blue-500',
  C2: 'from-purple-400 to-purple-500',
};

const LEVEL_LABELS: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
  C2: 'Proficiency',
};

type Step = 'list' | 'info' | 'test' | 'result';

interface Result {
  total_questions: number;
  correct_answers: number;
  score: number;
  level: string;
  level_description: string;
  time_spent: number;
}

export default function LevelTestPage() {
  const [step, setStep] = useState<Step>('list');
  const [tests, setTests] = useState<LevelTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<LevelTest | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '' });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    api.get('leveltest/tests/?is_active=true').then(r => setTests(r.data.results || r.data)).catch(() => {});
  }, []);

  const selectTest = async (test: LevelTest) => {
    setSelectedTest(test);
    setStep('info');
  };

  const startTest = async () => {
    if (!selectedTest) return;
    setLoading(true);
    try {
      const r = await api.get(`leveltest/tests/${selectedTest.id}/`);
      const data = r.data;
      setQuestions(data.questions || []);
      setCurrent(0);
      setAnswers({});
      setTimeLeft(selectedTest.time_limit * 60);
      startTimeRef.current = Date.now();
      setStep('test');
    } catch {
      alert('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Timer
  useEffect(() => {
    if (step !== 'test') return;
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectAnswer = (qId: number, answer: string) => {
    setAnswers(prev => ({ ...prev, [qId]: answer }));
  };

  const handleSubmit = useCallback(async () => {
    if (submitting || !selectedTest) return;
    setSubmitting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    const answerList = Object.entries(answers).map(([qId, answer]) => ({
      question_id: Number(qId),
      answer,
    }));

    try {
      const r = await api.post(`leveltest/tests/${selectedTest.id}/submit/`, {
        name: form.name,
        phone: form.phone,
        answers: answerList,
        time_spent: timeSpent,
      });
      setResult(r.data);
      setStep('result');
    } catch {
      alert('Xatolik yuz berdi');
    } finally {
      setSubmitting(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answers, form, selectedTest, submitting]);

  const restart = () => {
    setStep('list');
    setSelectedTest(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setForm({ name: '', phone: '' });
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0;
  const q = questions[current];
  const timePercent = selectedTest ? (timeLeft / (selectedTest.time_limit * 60)) * 100 : 100;

  return (
    <div className="pt-24 md:pt-28 pb-16 min-h-screen">
      <div className="container-custom">
        {/* ═══ TEST LIST ═══ */}
        <AnimatePresence mode="wait">
          {step === 'list' && (
            <motion.div key="list" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="text-center mb-10">
                <span className="badge badge-primary mb-3 inline-flex items-center gap-1">
                  <Brain size={14} /> Darajani aniqlash
                </span>
                <h1 className="section-title">Ingliz tili darajangizni biling!</h1>
                <p className="section-subtitle">
                  Professional test orqali o&apos;z darajangizni aniqlang. Test yechish bepul va cheksiz!
                </p>
              </div>

              {/* Level cards */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-12">
                {Object.entries(LEVEL_LABELS).map(([level, label]) => (
                  <div key={level} className="card text-center py-4 group hover:-translate-y-1 transition-all duration-200">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${LEVEL_COLORS[level]} text-white flex items-center justify-center font-bold text-lg mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                      {level}
                    </div>
                    <p className="text-xs text-text-secondary font-medium">{label}</p>
                  </div>
                ))}
              </div>

              {tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map(test => (
                    <motion.div
                      key={test.id}
                      whileHover={{ y: -4 }}
                      className="card card-glow cursor-pointer group"
                      onClick={() => selectTest(test)}
                    >
                      <div className="w-full h-36 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl mb-4 flex items-center justify-center">
                        <Brain size={48} className="text-primary/30 group-hover:scale-110 transition-transform" />
                      </div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{test.title}</h3>
                      {test.description && (
                        <p className="text-text-secondary text-sm mt-2 line-clamp-2">{test.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border text-sm text-text-secondary">
                        <span className="flex items-center gap-1"><Clock size={14} /> {test.time_limit} daqiqa</span>
                        <span className="flex items-center gap-1"><Target size={14} /> {test.questions_count} savol</span>
                      </div>
                      <button className="btn-primary w-full mt-4 text-sm">
                        Testni boshlash <ArrowRight size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <AlertCircle size={48} className="text-text-secondary/30 mx-auto mb-4" />
                  <p className="text-text-secondary text-lg">Hozircha testlar yo&apos;q</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ TEST INFO & FORM ═══ */}
          {step === 'info' && selectedTest && (
            <motion.div key="info" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-xl mx-auto">
              <button onClick={() => setStep('list')} className="flex items-center gap-1 text-text-secondary hover:text-primary mb-6 text-sm">
                <ChevronLeft size={16} /> Orqaga
              </button>

              <div className="card">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-white flex items-center justify-center mx-auto mb-4">
                    <Brain size={32} />
                  </div>
                  <h2 className="text-xl font-bold">{selectedTest.title}</h2>
                  {selectedTest.description && <p className="text-text-secondary text-sm mt-2">{selectedTest.description}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-bg-secondary rounded-xl p-3 text-center">
                    <Clock size={20} className="text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedTest.time_limit} daqiqa</p>
                    <p className="text-xs text-text-secondary">Vaqt chegarasi</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3 text-center">
                    <Target size={20} className="text-primary mx-auto mb-1" />
                    <p className="text-lg font-bold">{selectedTest.questions_count} ta</p>
                    <p className="text-xs text-text-secondary">Savollar soni</p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-sm text-amber-800">
                  <p className="font-semibold mb-1">Qoidalar:</p>
                  <ul className="space-y-1">
                    <li>• Har bir savolda 4 ta variant beriladi</li>
                    <li>• Vaqt tugagach test avtomatik topshiriladi</li>
                    <li>• Natija darhol ko&apos;rsatiladi</li>
                    <li>• Testni istalgancha qayta ishlash mumkin</li>
                  </ul>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      <User size={14} className="inline mr-1" />Ism va familiya
                    </label>
                    <input
                      className="input-field"
                      placeholder="Ism familiya"
                      value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      <Phone size={14} className="inline mr-1" />Telefon raqam
                    </label>
                    <input
                      className="input-field"
                      type="tel"
                      placeholder="+998 90 123 45 67"
                      value={form.phone}
                      onChange={e => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>

                <button
                  onClick={startTest}
                  disabled={loading || !form.name.trim() || !form.phone.trim()}
                  className="btn-primary w-full disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <>Testni boshlash <ArrowRight size={16} /></>}
                </button>
              </div>
            </motion.div>
          )}

          {/* ═══ TEST TAKING ═══ */}
          {step === 'test' && q && (
            <motion.div key="test" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* Top bar */}
              <div className="sticky top-16 md:top-20 z-30 bg-white/95 backdrop-blur-md border-b border-border -mx-4 px-4 py-3 mb-6">
                <div className="container-custom">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-secondary">
                      Savol {current + 1} / {questions.length}
                    </span>
                    <span className={`flex items-center gap-1 text-sm font-bold ${timePercent < 20 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
                      <Timer size={16} /> {formatTime(timeLeft)}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  {/* Timer bar */}
                  <div className="w-full h-1 bg-bg-secondary rounded-full overflow-hidden mt-1">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${timePercent < 20 ? 'bg-red-500' : 'bg-green-400'}`}
                      style={{ width: `${timePercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="max-w-3xl mx-auto">
                {/* Question navigation pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {questions.map((qq, i) => (
                    <button
                      key={qq.id}
                      onClick={() => setCurrent(i)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                        i === current
                          ? 'bg-primary text-white scale-110 shadow-lg shadow-primary/30'
                          : answers[qq.id]
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-bg-secondary text-text-secondary hover:bg-primary-light'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                {/* Question card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="card"
                  >
                    <p className="text-lg font-semibold mb-6 leading-relaxed">{q.text}</p>
                    <div className="flex flex-col gap-3">
                      {(['A', 'B', 'C', 'D'] as const).map(opt => {
                        const optText = q[`option_${opt.toLowerCase()}` as keyof Question] as string;
                        const selected = answers[q.id] === opt;
                        return (
                          <button
                            key={opt}
                            onClick={() => selectAnswer(q.id, opt)}
                            className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                              selected
                                ? 'border-primary bg-primary/5 shadow-md shadow-primary/10'
                                : 'border-border hover:border-primary/40 hover:bg-bg-secondary'
                            }`}
                          >
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-colors ${
                              selected ? 'bg-primary text-white' : 'bg-bg-secondary text-text-secondary'
                            }`}>
                              {opt}
                            </span>
                            <span className="text-sm font-medium">{optText}</span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setCurrent(Math.max(0, current - 1))}
                    disabled={current === 0}
                    className="btn-outline text-sm disabled:opacity-30"
                  >
                    <ChevronLeft size={16} /> Oldingi
                  </button>

                  {current === questions.length - 1 ? (
                    <button
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="btn-primary text-sm"
                    >
                      {submitting ? <Loader2 size={16} className="animate-spin" /> : <>Topshirish <CheckCircle size={16} /></>}
                    </button>
                  ) : (
                    <button
                      onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))}
                      className="btn-primary text-sm"
                    >
                      Keyingi <ChevronRight size={16} />
                    </button>
                  )}
                </div>

                {/* Answered count */}
                <div className="text-center mt-4">
                  <p className="text-sm text-text-secondary">
                    {answeredCount} / {questions.length} savolga javob berildi
                    {answeredCount === questions.length && (
                      <button onClick={handleSubmit} disabled={submitting} className="text-primary font-semibold ml-2 hover:underline">
                        — Topshirish
                      </button>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ RESULT ═══ */}
          {step === 'result' && result && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg mx-auto">
              <div className="card text-center">
                {/* Level badge */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${LEVEL_COLORS[result.level] || 'from-primary to-primary/80'} text-white flex items-center justify-center mx-auto mb-6 shadow-2xl`}
                >
                  <div>
                    <p className="text-3xl font-extrabold">{result.level}</p>
                    <p className="text-xs opacity-80">{LEVEL_LABELS[result.level]}</p>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <h2 className="text-2xl font-extrabold mb-2">Natijangiz tayyor!</h2>
                  <p className="text-text-secondary">{result.level_description}</p>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="grid grid-cols-3 gap-3 mt-8 mb-6"
                >
                  <div className="bg-bg-secondary rounded-xl p-3">
                    <Trophy size={20} className="text-amber-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold text-primary">{result.score}%</p>
                    <p className="text-xs text-text-secondary">Ball</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3">
                    <BarChart3 size={20} className="text-green-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{result.correct_answers}/{result.total_questions}</p>
                    <p className="text-xs text-text-secondary">To&apos;g&apos;ri</p>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3">
                    <Timer size={20} className="text-blue-500 mx-auto mb-1" />
                    <p className="text-2xl font-bold">{formatTime(result.time_spent)}</p>
                    <p className="text-xs text-text-secondary">Vaqt</p>
                  </div>
                </motion.div>

                {/* Score bar */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mb-6"
                >
                  <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span>A1</span><span>A2</span><span>B1</span><span>B2</span><span>C1</span><span>C2</span>
                  </div>
                  <div className="w-full h-3 bg-bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${result.score}%` }}
                      transition={{ duration: 1.5, delay: 1, ease: 'easeOut' }}
                      className={`h-full rounded-full bg-gradient-to-r ${LEVEL_COLORS[result.level]}`}
                    />
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="flex flex-col gap-3">
                  <button onClick={restart} className="btn-primary w-full">
                    <RotateCcw size={16} /> Qayta ishlash
                  </button>
                  <a href="/courses" className="btn-outline w-full">
                    Kurslarni ko&apos;rish <ArrowRight size={16} />
                  </a>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
