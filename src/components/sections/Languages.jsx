import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const STATIC = [
  { id: 1, name: 'Afaan Oromo', level: 'Native',  proficiency: 100, flag: '🇪🇹', color: '#10B981' },
  { id: 2, name: 'Amharic',     level: 'Fluent',   proficiency: 90,  flag: '🇪🇹', color: '#3B82F6' },
  { id: 3, name: 'English',     level: 'Fluent',   proficiency: 85,  flag: '🌍', color: '#06B6D4' },
];

const LangCard = ({ lang, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 25 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.12 }}
    whileHover={{ y: -6 }}
    className="card-hover p-7 text-center relative overflow-hidden group"
  >
    {/* Glow orb behind card */}
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ background: `radial-gradient(circle at 50% 0%, ${lang.color}12, transparent 65%)` }} />

    <div className="text-5xl mb-4">{lang.flag}</div>
    <h3 className="text-white font-bold text-xl mb-1">{lang.name}</h3>
    <p className="text-sm font-semibold mb-5" style={{ color: lang.color }}>{lang.level}</p>

    {/* Circular SVG progress */}
    <div className="relative w-24 h-24 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
        <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(30,45,69,0.8)" strokeWidth="2.5" />
        <motion.circle
          cx="18" cy="18" r="15.9" fill="none"
          stroke={lang.color} strokeWidth="2.5" strokeLinecap="round"
          initial={{ strokeDasharray: '0 100' }}
          whileInView={{ strokeDasharray: `${lang.proficiency} 100` }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, delay: index * 0.12, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-bold text-base" style={{ color: lang.color }}>{lang.proficiency}%</span>
      </div>
    </div>
  </motion.div>
);

const Languages = () => {
  const [langs, setLangs] = useState(STATIC);
  useEffect(() => {
    api.get('/languages').then(r => { if (r.data.data?.length) setLangs(r.data.data); }).catch(() => {});
  }, []);
  return (
    <section id="languages" className="py-24 px-4 md:px-8 max-w-7xl mx-auto" style={{ background: 'rgba(8,15,30,0.4)' }}>
      <SectionHeader title="Languages" subtitle="Languages I communicate with professionally and personally" />
      <div className="grid sm:grid-cols-3 gap-5 max-w-2xl mx-auto">
        {langs.map((l, i) => <LangCard key={l.id || l.name} lang={l} index={i} />)}
      </div>
    </section>
  );
};
export default Languages;
