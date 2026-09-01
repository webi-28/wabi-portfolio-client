import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaTrophy, FaCalendar, FaMapMarkerAlt, FaMedal } from 'react-icons/fa';
import { HiAcademicCap } from 'react-icons/hi';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const STATIC = [{
  id: 1, institution: 'Haramaya University', degree: 'Bachelor of Science',
  field_of_study: 'Information Technology', gpa: 3.55, max_gpa: 4.00,
  start_date: '2020-09-01', end_date: '2026-06-30', is_current: 0,
  location: 'Haramaya, Ethiopia',
  description: 'Completed a four-year BSc program in Information Technology. Maintained a strong academic record with a CGPA of 3.55/4.00. Successfully passed the Ethiopian National Exit Examination with a score of 64/100.',
  achievements: ["Grade A – Final Year Project", "CGPA 3.55/4.00", "National Exit Exam: 64/100"],
}];

const EducationCard = ({ edu, index }) => {
  const achievements = Array.isArray(edu.achievements) ? edu.achievements : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative"
    >
      {/* Timeline line */}
      <div className="absolute left-6 top-16 bottom-0 w-px bg-gradient-to-b from-primary/50 to-transparent" />

      <div className="flex gap-6">
        {/* Icon */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="relative flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shadow-glow z-10"
        >
          <FaGraduationCap className="w-5 h-5 text-white" />
        </motion.div>

        {/* Content */}
        <div className="flex-1 card p-6 mb-8">
          {/* Header */}
          <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold text-white">{edu.degree} in <span className="gradient-text">{edu.field_of_study}</span></h3>
              <p className="text-primary font-semibold text-sm mt-1">{edu.institution}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 text-xs font-mono text-slate-500">
              <div className="flex items-center gap-1.5">
                <FaCalendar className="w-3 h-3" />
                {edu.start_date?.slice(0, 7)} → {edu.is_current ? 'Present' : edu.end_date?.slice(0, 7)}
              </div>
              {edu.location && (
                <div className="flex items-center gap-1.5">
                  <FaMapMarkerAlt className="w-3 h-3" />
                  {edu.location}
                </div>
              )}
            </div>
          </div>

          {/* GPA badge */}
          {edu.gpa && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-4 border"
              style={{ backgroundColor: '#F59E0B10', borderColor: '#F59E0B30' }}>
              <FaTrophy className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-white font-bold text-sm">CGPA: {edu.gpa}/{edu.max_gpa || '4.00'}</span>
              <span className="text-slate-500 text-xs">— Excellent</span>
            </div>
          )}

          {edu.description && <p className="text-slate-400 text-sm leading-relaxed mb-4">{edu.description}</p>}

          {/* Achievements */}
          {achievements.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {achievements.map(a => (
                <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border"
                  style={{ backgroundColor: '#F59E0B10', borderColor: '#F59E0B25', color: '#FBBF24' }}>
                  <FaMedal className="w-3 h-3" /> {a}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Education = () => {
  const [items, setItems] = useState(STATIC);
  useEffect(() => {
    api.get('/education').then(res => { if (res.data.data?.length) setItems(res.data.data); }).catch(() => {});
  }, []);
  return (
    <section id="education" className="section bg-[#080F1E]/60">
      <SectionHeader number={4} title="My Education" subtitle="Academic journey and qualifications" />
      <div className="max-w-3xl mx-auto">
        {items.map((e, i) => <EducationCard key={e.id} edu={e} index={i} />)}
      </div>
    </section>
  );
};
export default Education;
