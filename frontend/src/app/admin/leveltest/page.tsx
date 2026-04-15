'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import api from '@/lib/api';
import { LevelTest, Question, TestResultData } from '@/types';

const emptyForm = { title: '', description: '', time_limit: '30', is_active: true };
const emptyQ = { text: '', option_a: '', option_b: '', option_c: '', option_d: '', correct: 'A', order: 0 };

export default function AdminLevelTestPage() {
  const [tests, setTests] = useState<LevelTest[]>([]);
  const [editing, setEditing] = useState<number | 'new' | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [questions, setQuestions] = useState<(Question & { _new?: boolean })[]>([]);
  const [saving, setSaving] = useState(false);
  const [expandedTest, setExpandedTest] = useState<number | null>(null);
  const [results, setResults] = useState<TestResultData[]>([]);
  const [showResults, setShowResults] = useState<number | null>(null);

  const load = () => api.get('leveltest/tests/').then(r => setTests(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const openNew = () => {
    setForm(emptyForm);
    setQuestions([]);
    setEditing('new');
  };

  const openEdit = async (t: LevelTest) => {
    setForm({ title: t.title, description: t.description, time_limit: String(t.time_limit), is_active: t.is_active });
    try {
      const r = await api.get(`leveltest/tests/${t.id}/`);
      setQuestions(r.data.questions || []);
    } catch {
      setQuestions([]);
    }
    setEditing(t.id);
  };

  const addQuestion = () => {
    setQuestions([...questions, { ...emptyQ, id: Date.now(), order: questions.length, _new: true } as Question & { _new?: boolean }]);
  };

  const updateQuestion = (idx: number, field: string, value: string) => {
    const updated = [...questions];
    (updated[idx] as unknown as Record<string, unknown>)[field] = value;
    setQuestions(updated);
  };

  const removeQuestion = async (idx: number) => {
    const q = questions[idx];
    if (!(q as Question & { _new?: boolean })._new && editing !== 'new') {
      await api.delete(`leveltest/tests/${editing}/questions/${q.id}/`).catch(() => {});
    }
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const save = async () => {
    setSaving(true);
    try {
      let testId: number;
      const payload = {
        title: form.title,
        description: form.description,
        time_limit: Number(form.time_limit),
        is_active: form.is_active,
      };

      if (editing === 'new') {
        const r = await api.post('leveltest/tests/', payload);
        testId = r.data.id;
      } else {
        await api.patch(`leveltest/tests/${editing}/`, payload);
        testId = editing as number;
      }

      // Save questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const qData = { text: q.text, option_a: q.option_a, option_b: q.option_b, option_c: q.option_c, option_d: q.option_d, correct: q.correct, order: i };

        if ((q as Question & { _new?: boolean })._new) {
          await api.post(`leveltest/tests/${testId}/questions/`, qData);
        } else {
          await api.patch(`leveltest/tests/${testId}/questions/${q.id}/`, qData);
        }
      }

      setEditing(null);
      load();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: unknown } };
      const data = axiosErr?.response?.data;
      alert('Xatolik:\n' + (data ? JSON.stringify(data, null, 2) : "Noma'lum xatolik"));
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`leveltest/tests/${id}/`);
    load();
  };

  const viewResults = async (testId: number) => {
    if (showResults === testId) { setShowResults(null); return; }
    try {
      const r = await api.get('leveltest/results/');
      setResults((r.data.results || r.data).filter((res: TestResultData) => res.test === testId));
      setShowResults(testId);
    } catch { setResults([]); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Darajani aniqlash testlari</h1>
        <button onClick={openNew} className="btn-primary text-sm"><Plus size={16} /> Yangi test</button>
      </div>

      {/* Edit modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[95vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-lg">{editing === 'new' ? 'Yangi test' : 'Testni tahrirlash'}</h3>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-bg-secondary rounded-lg"><X size={20} /></button>
            </div>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-1.5">Test nomi</label>
                  <input className="input-field" placeholder="English Level Test" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Vaqt (daqiqa)</label>
                  <input className="input-field" type="number" value={form.time_limit} onChange={e => setForm({ ...form, time_limit: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1.5">Tavsif</label>
                <textarea className="input-field" rows={2} placeholder="Test haqida..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 rounded accent-primary" />
                <span className="font-semibold">Faol (foydalanuvchilarga ko&apos;rinadi)</span>
              </label>

              {/* Questions */}
              <div className="border-t border-border pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-bold">Savollar ({questions.length})</h4>
                  <button onClick={addQuestion} className="text-sm text-primary font-semibold flex items-center gap-1 hover:underline">
                    <Plus size={14} /> Savol qo&apos;shish
                  </button>
                </div>

                <div className="flex flex-col gap-4 max-h-[50vh] overflow-auto">
                  {questions.map((q, idx) => (
                    <div key={q.id || idx} className="bg-bg-secondary rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <span className="text-sm font-bold text-primary">Savol #{idx + 1}</span>
                        <button onClick={() => removeQuestion(idx)} className="text-red-500 hover:bg-red-50 p-1 rounded-lg"><Trash2 size={14} /></button>
                      </div>

                      <textarea
                        className="input-field mb-3"
                        rows={2}
                        placeholder="Savol matni..."
                        value={q.text}
                        onChange={e => updateQuestion(idx, 'text', e.target.value)}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                        {(['A', 'B', 'C', 'D'] as const).map(opt => (
                          <div key={opt} className="flex items-center gap-2">
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${q.correct === opt ? 'bg-green-500 text-white' : 'bg-white text-text-secondary border border-border'}`}>
                              {opt}
                            </span>
                            <input
                              className="input-field flex-1"
                              placeholder={`Variant ${opt}`}
                              value={(q as unknown as Record<string, unknown>)[`option_${opt.toLowerCase()}`] as string}
                              onChange={e => updateQuestion(idx, `option_${opt.toLowerCase()}`, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold mb-1">To&apos;g&apos;ri javob</label>
                        <div className="flex gap-2">
                          {(['A', 'B', 'C', 'D'] as const).map(opt => (
                            <button
                              key={opt}
                              onClick={() => updateQuestion(idx, 'correct', opt)}
                              className={`w-10 h-10 rounded-lg font-bold text-sm transition-all ${q.correct === opt ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-white border border-border hover:border-green-400'}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {questions.length === 0 && (
                  <p className="text-center text-text-secondary py-6 text-sm">Hali savollar qo&apos;shilmagan</p>
                )}
              </div>

              <button onClick={save} disabled={saving} className="btn-primary w-full">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Saqlanmoqda...</> : 'Saqlash'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tests list */}
      <div className="flex flex-col gap-4">
        {tests.map(test => (
          <div key={test.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-lg">{test.title}</h3>
                  <div className="flex items-center gap-3 text-sm text-text-secondary mt-1">
                    <span>{test.questions_count} savol</span>
                    <span>{test.time_limit} daqiqa</span>
                    <span className={`badge text-xs ${test.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {test.is_active ? 'Faol' : 'Nofaol'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => viewResults(test.id)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={16} /></button>
                <button onClick={() => openEdit(test)} className="p-1.5 text-primary hover:bg-primary-light rounded-lg"><Pencil size={16} /></button>
                <button onClick={() => remove(test.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button>
              </div>
            </div>

            {/* Results dropdown */}
            {showResults === test.id && (
              <div className="mt-4 pt-4 border-t border-border">
                <h4 className="font-semibold text-sm mb-3">Natijalar ({results.length})</h4>
                {results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2 font-medium">Ism</th>
                          <th className="text-left py-2 px-2 font-medium">Telefon</th>
                          <th className="text-left py-2 px-2 font-medium">Daraja</th>
                          <th className="text-left py-2 px-2 font-medium">Ball</th>
                          <th className="text-left py-2 px-2 font-medium">Sana</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.map(r => (
                          <tr key={r.id} className="border-b border-border last:border-0">
                            <td className="py-2 px-2">{r.name}</td>
                            <td className="py-2 px-2">{r.phone}</td>
                            <td className="py-2 px-2"><span className="badge badge-primary text-xs">{r.level}</span></td>
                            <td className="py-2 px-2">{r.correct_answers}/{r.total_questions} ({r.score}%)</td>
                            <td className="py-2 px-2 text-text-secondary">{new Date(r.created_at).toLocaleDateString('uz')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm">Hali natijalar yo&apos;q</p>
                )}
              </div>
            )}
          </div>
        ))}
        {tests.length === 0 && <p className="text-center text-text-secondary py-6">Testlar yo&apos;q</p>}
      </div>
    </div>
  );
}
