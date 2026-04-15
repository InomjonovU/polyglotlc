'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, User, Send, Share2, Copy, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';
import api from '@/lib/api';
import { useAuth } from '@/lib/auth';
import { BlogPost, BlogImage, Comment } from '@/types';
import Link from 'next/link';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [images, setImages] = useState<BlogImage[]>([]);
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    if (!slug) return;
    api.get(`blog/posts/${slug}/`).then((r) => {
      setPost(r.data);
      setComments(r.data.comments || []);
      setImages(r.data.images || []);
    }).catch(() => {});
  }, [slug]);

  const submitComment = async () => {
    if (!commentText.trim()) return;
    try {
      const res = await api.post(`blog/posts/${slug}/comments/`, { text: commentText });
      setComments([res.data, ...comments]);
      setCommentText('');
    } catch {
      alert('Izoh yuborishda xatolik');
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Havola nusxalandi!');
  };

  const allImages = [
    ...(post?.image ? [{ id: 0, image: post.image, caption: post.title, order: -1 }] : []),
    ...images,
  ];

  const navigateLightbox = (dir: number) => {
    if (lightbox === null) return;
    const idx = allImages.findIndex((img) => img.id === lightbox);
    const next = idx + dir;
    if (next >= 0 && next < allImages.length) {
      setLightbox(allImages[next].id);
    }
  };

  if (!post) {
    return (
      <div className="pt-24 md:pt-28 pb-10 min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-text-secondary">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 md:pt-28 pb-16">
      <div className="container-custom max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Back link */}
          <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-6">
            <ChevronLeft size={16} /> Yangiliklarga qaytish
          </Link>

          {/* Category badge */}
          <div className="badge badge-primary mb-4">{post.category_display}</div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-text-secondary text-sm">
            <span className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={14} className="text-primary" />
              </div>
              {post.author_name}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={14} /> {post.reading_time} daqiqa o&apos;qish
            </span>
            <span>{new Date(post.created_at).toLocaleDateString('uz', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>

          {/* Cover image */}
          {post.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-8 rounded-2xl overflow-hidden cursor-pointer group relative"
              onClick={() => setLightbox(0)}
            >
              <img src={post.image} alt={post.title} className="w-full max-h-[500px] object-cover group-hover:scale-[1.02] transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <ZoomIn size={32} className="text-white opacity-0 group-hover:opacity-80 transition-opacity" />
              </div>
            </motion.div>
          )}

          {/* Rich text content */}
          <div
            className="prose prose-lg max-w-none mt-10 rich-text-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Extra images gallery */}
          {images.length > 0 && (
            <div className="mt-10">
              <h3 className="text-lg font-bold mb-4">Rasmlar</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {images.map((img) => (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl overflow-hidden cursor-pointer group relative aspect-[4/3]"
                    onClick={() => setLightbox(img.id)}
                  >
                    <img src={img.image} alt={img.caption || ''} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-80 transition-opacity" />
                    </div>
                    {img.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <p className="text-white text-xs">{img.caption}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Share */}
          <div className="flex items-center gap-3 mt-10 pt-6 border-t border-[var(--border)]">
            <Share2 size={18} className="text-text-secondary" />
            <span className="text-sm text-text-secondary mr-1">Ulashish:</span>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary text-sm py-1.5 px-4"
            >
              Telegram
            </a>
            <button onClick={copyLink} className="btn-outline text-sm py-1.5 px-4 flex items-center gap-1">
              <Copy size={14} /> Nusxa olish
            </button>
          </div>

          {/* Comments */}
          <div className="mt-10">
            <h3 className="text-xl font-bold mb-4">Izohlar ({comments.length})</h3>

            {user ? (
              <div className="flex gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0">
                  {user.first_name?.[0] || 'U'}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <textarea
                    className="input-field"
                    rows={3}
                    placeholder="Izoh yozing..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button onClick={submitComment} className="btn-primary self-end text-sm px-5">
                    <Send size={16} /> Yuborish
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-[var(--bg-secondary)] p-5 rounded-xl mb-6 text-center">
                <p className="text-text-secondary text-sm">
                  Izoh yozish uchun{' '}
                  <Link href="/login" className="text-primary font-semibold hover:underline">tizimga kiring</Link>
                </p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl"
                >
                  <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shrink-0">
                    {comment.user_name?.[0] || 'U'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{comment.user_name}</span>
                      <span className="text-text-secondary text-xs">
                        {new Date(comment.created_at).toLocaleDateString('uz')}
                      </span>
                    </div>
                    <p className="text-sm mt-1 leading-relaxed">{comment.text}</p>
                  </div>
                </motion.div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-text-secondary text-sm py-6">Hali izohlar yo&apos;q</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
              className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-10"
            >
              <X size={28} />
            </button>

            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
                  className="absolute left-4 text-white/70 hover:text-white p-2 z-10"
                >
                  <ChevronLeft size={36} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
                  className="absolute right-4 text-white/70 hover:text-white p-2 z-10"
                >
                  <ChevronRight size={36} />
                </button>
              </>
            )}

            <motion.img
              key={lightbox}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              src={allImages.find((img) => img.id === lightbox)?.image}
              alt=""
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
              {allImages.findIndex((img) => img.id === lightbox) + 1} / {allImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
