'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, MessageCircle } from 'lucide-react';
import api from '@/lib/api';
import { BlogPost } from '@/types';

const categories = [
  { value: '', label: 'Barchasi' },
  { value: 'ielts', label: 'IELTS' },
  { value: 'it', label: 'IT' },
  { value: 'news', label: 'Markaz yangiliklari' },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [category, setCategory] = useState('');

  useEffect(() => {
    const params = category ? `?category=${category}` : '';
    api.get(`blog/posts/${params}`).then((r) => setPosts(r.data.results || r.data)).catch(() => {});
  }, [category]);

  return (
    <div className="pt-24 md:pt-28 pb-10">
      <div className="container-custom">
        <h1 className="section-title text-center">Yangiliklar</h1>
        <p className="section-subtitle text-center mb-8">Eng so&apos;nggi maqolalar va yangiliklar</p>

        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                category === c.value
                  ? 'bg-primary text-white'
                  : 'bg-[var(--bg-secondary)] text-text-secondary hover:bg-[var(--primary-light)]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/blog/${post.slug}`} className="card block hover:-translate-y-1 transition-transform">
                {post.image && (
                  <img src={post.image} alt={post.title} className="w-full h-44 object-cover rounded-lg mb-4" />
                )}
                <div className="badge badge-primary mb-2">{post.category_display}</div>
                <h3 className="text-lg font-bold line-clamp-2">{post.title}</h3>
                <div className="flex items-center gap-4 mt-3 text-text-secondary text-xs">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {post.reading_time} daq
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} /> {post.comments_count} izoh
                  </span>
                  <span>{new Date(post.created_at).toLocaleDateString('uz')}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {posts.length === 0 && (
          <p className="text-center text-text-secondary py-10">Hozircha maqolalar yo&apos;q</p>
        )}
      </div>
    </div>
  );
}
