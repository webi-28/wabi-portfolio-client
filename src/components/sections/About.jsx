import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaGraduationCap, FaMapMarkerAlt, FaEnvelope, FaLanguage, FaCalendar, FaPhone } from 'react-icons/fa';
import { HiChip } from 'react-icons/hi';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const About = () => {
  const [s, setS] = useState({
    owner_name: 'Webi Worku Alemu',
    owner_degree: 'BSc in Information Technology',
    owner_university: 'Haramaya University',
    owner_graduation: 'June 2026',
    owner_location: 'Addis Ababa, Ethiopia',
    owner_email: 'wworku28@gmail.com',
    owner_phone: '0952879685',
    owner_languages: 'Afaan Oromo, Amharic, English',
    owner_cgpa: '3.55/4.00',
    about_summary: 'Recent Information Technology graduate with a CGPA of 3.55/4.00. Skilled in web development, networking, database management, and IT support. Strong problem-solving and teamwork abilities with a passion for technology and continuous learning.',
    about_objective: 'Seeking an opportunity to contribute technical skills and grow professionally in the IT industry.',
  });
  const [counts, setCounts] = useState({ projects: 4, certs: 3 });

  useEffect(() => {
    api.get('/settings').then(r => { if (r.data.data) setS(p => ({ ...p, ...r.data.data })); }).catch(() => {});
    api.get('/projects?limit=1').then(r => { const t = r.data.data?.pagination?.total; if (t) setCounts(p => ({ ...p, projects: t })); }).catch(() => {});
    api.get('/certificates').then(r => { const t = r.data.data?.length; if (t) setCounts(p => ({ ...p, certs: t })); }).catch(() => {});
  }, []);

  const INFO = [
    { icon: FaUser,          label: 'Full Name',  value: s.owner_name },
    { icon: FaGraduationCap, label: 'Degree',     value: s.owner_degree },
    { icon: HiChip,          label: 'University', value: s.owner_university },
    { icon: FaCalendar,      label: 'Graduated',  value: s.owner_graduation },
    { icon: FaMapMarkerAlt,  label: 'Location',   value: s.owner_location },
    { icon: FaEnvelope,      label: 'Email',      value: s.owner_email },
    { icon: FaPhone,         label: 'Phone',      value: s.owner_phone },
    { icon: FaLanguage,      label: 'Languages',  value: s.owner_languages },
  ];

  const STATS = [
    { value: s.owner_cgpa, label: 'CGPA',         color: '#FBBF24' },
    { value: `${counts.projects}+`, label: 'Projects',  color: '#60A5FA' },
    { value: `${counts.certs}+`,    label: 'Certs',     color: '#34D399' },
    { value: '2026',       label: 'Graduate',     color: '#A78BFA' },
  ];

  return (
    <section id="about" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <SectionHeader title="About Me" subtitle="Get to know my background, education, and what drives me as a developer" />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left */}
        <div className="space-y-5">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-blue-500 to-cyan-400" />
              <h3 className="text-white font-bold text-base">Professional Summary</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{s.about_summary}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-emerald-400" />
              <h3 className="text-white font-bold text-base">Career Objective</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{s.about_objective}</p>
          </motion.div>

          {/* Stats grid — centered */}
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }} className="grid grid-cols-4 gap-3 justify-items-center">
            {STATS.map(({ value, label, color }) => (
              <div key={label} className="card-hover p-4 text-center">
                <div className="text-xl font-black mb-0.5" style={{ color }}>{value}</div>
                <div className="text-slate-600 text-xs">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — info */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card p-6">
          <h3 className="text-white font-bold text-base mb-5 flex items-center gap-3">
            <div className="w-1.5 h-6 rounded-full bg-gradient-to-b from-purple-400 to-blue-400" />
            Personal Information
          </h3>
          <div className="space-y-2">
            {INFO.map(({ icon: Icon, label, value }, i) => (
              <motion.div key={label} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 hover:bg-slate-800/40 group">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all group-hover:scale-110"
                  style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}>
                  <Icon className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-slate-600 text-xs mb-0.5">{label}</p>
                  <p className="text-white font-medium text-sm truncate">{value}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default About;
