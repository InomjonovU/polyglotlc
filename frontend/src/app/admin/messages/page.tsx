'use client';

import { useEffect, useState } from 'react';
import { Mail, MailOpen, Trash2, Phone } from 'lucide-react';
import api from '@/lib/api';
import { ContactMessage } from '@/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [selected, setSelected] = useState<ContactMessage | null>(null);

  const load = () => api.get('contact/').then((r) => setMessages(r.data.results || r.data));
  useEffect(() => { load(); }, []);

  const markRead = async (msg: ContactMessage) => {
    setSelected(msg);
    if (!msg.is_read) {
      try {
        await api.patch(`contact/${msg.id}/`, { is_read: true });
        setMessages(messages.map(m => m.id === msg.id ? { ...m, is_read: true } : m));
      } catch {}
    }
  };

  const remove = async (id: number) => {
    if (!confirm("O'chirishni tasdiqlaysizmi?")) return;
    await api.delete(`contact/${id}/`);
    setSelected(null);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Xabarlar</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Messages list */}
        <div className="md:col-span-1 flex flex-col gap-2 max-h-[70vh] overflow-auto">
          {messages.map((msg) => (
            <button
              key={msg.id}
              onClick={() => markRead(msg)}
              className={`card text-left transition-all hover:border-primary/20 ${
                selected?.id === msg.id ? 'border-primary/30 bg-primary-light/30' : ''
              } ${!msg.is_read ? 'border-l-4 border-l-primary' : ''}`}
            >
              <div className="flex items-center gap-2 mb-1">
                {msg.is_read ? <MailOpen size={14} className="text-text-secondary" /> : <Mail size={14} className="text-primary" />}
                <span className={`text-sm ${!msg.is_read ? 'font-bold' : 'font-medium'}`}>{msg.name}</span>
              </div>
              <p className="text-xs text-text-secondary truncate">{msg.message}</p>
              <p className="text-xs text-text-secondary/60 mt-1">{new Date(msg.created_at).toLocaleDateString('uz')}</p>
            </button>
          ))}
          {messages.length === 0 && <p className="text-center text-text-secondary py-10">Xabarlar yo&apos;q</p>}
        </div>

        {/* Message detail */}
        <div className="md:col-span-2">
          {selected ? (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">{selected.name}</h3>
                <button onClick={() => remove(selected.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-text-secondary mb-4">
                <Phone size={14} />
                <span>{selected.phone}</span>
                <span className="text-text-secondary/40">|</span>
                <span>{new Date(selected.created_at).toLocaleString('uz')}</span>
              </div>
              <div className="bg-bg-secondary rounded-xl p-4">
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
            </div>
          ) : (
            <div className="card text-center py-20 text-text-secondary">
              <Mail size={48} className="mx-auto mb-4 opacity-20" />
              <p>Xabarni tanlang</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
