'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock } from 'lucide-react';
import api from '@/lib/api';
import { Branch } from '@/types';

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);

  useEffect(() => {
    api.get('branches/').then((r) => setBranches(r.data.results || r.data)).catch(() => {});
  }, []);

  return (
    <div className="pt-24 md:pt-28 pb-10">
      <div className="container-custom">
        <h1 className="section-title text-center">Filiallarimiz</h1>
        <p className="section-subtitle text-center mb-8">Sizga eng yaqin filialni toping</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {branches.map((branch, i) => (
            <motion.div
              key={branch.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card"
            >
              <h3 className="text-lg font-bold text-primary">{branch.name}</h3>
              <div className="flex flex-col gap-3 mt-4">
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                  <span>{branch.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={18} className="text-primary shrink-0" />
                  <a href={`tel:${branch.phone}`} className="hover:text-primary">{branch.phone}</a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={18} className="text-primary shrink-0" />
                  <span>{branch.working_hours}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {branches.length === 0 && (
          <p className="text-center text-text-secondary py-10">Ma&apos;lumotlar yuklanmoqda...</p>
        )}
      </div>
    </div>
  );
}
