import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaGraduationCap, FaCode, FaHeart, FaBrain, FaLaptopCode, FaStar } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const ICON_MAP = { FaTrophy, FaGraduationCap, FaCode, FaHeart, FaBrain, FaLaptopCode, FaStar };

const STATIC = [
  { id: 1, title: 'Grade A – Final Year Project', description: 'Achieved the highest grade for the Online Vacancy and Recruitment System capstone project.', icon: 'FaTrophy', color: '#F59E0B', issuer: 'Haramaya University' },
  { id: 2, title: 'CGPA 3.55/4.00', description: 'Maintained a strong academic record throughout the four-year BSc program in IT.', icon: 'FaGraduationCap', color: '#2563EB', issuer: 'Haramaya University' },
  { id: 3, title: '4 Major Academic Projects', description: 'Designed and delivered four comprehensive software systems during academic tenure.', icon: 'FaCode', color: '#10B981', issuer: 'Personal Achievement' },
  { id: 4, title: 'National Exit Exam: 64/100', description: 'Successfully passed the Ethiopian National Exit Examination with a score of 64/100.', icon: 'FaStar', color: '#06B6D4', issuer: 'Ethiopian Ministry of Education' },
  { id: 5, title: 'Volunteer Recognition', description: 'Recognized for outstanding community peace-building contributions.', icon: 'FaHeart', color: '#EF4444', issuer: 'Ministry of Peace, Ethiopia' },
  { id: 6, title: 'AI Fluency Certifications', description: 'Earned two Claude AI certifications from Anthropic — staying current with emerging tech.', icon: 'FaBrain', color: '#8B5CF6', issuer: 'Anthropic' },
];

const AchievementCard = ({ ach, index }) => {
  const Icon = ICON_MAP[ach.icon] || FaTrophy;
  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="card p-5 group relative overflow-hidden"
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${ach.color}, transparent)` }} />

      <div className="flex items-start gap-4">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.15 }}
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: ach.color + '18', border: `1px solid ${ach.color}30` }}
        >
          <Icon className="w-5 h-5" style={{ color: ach.color }} />
        </motion.div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-white text-sm mb-1 leading-snug">{ach.title}</h3>
          <p className="text-slate-500 text-xs leading-relaxed mb-2">{ach.description}</p>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono border"
            style={{ color: ach.color, borderColor: ach.color + '30', backgroundColor: ach.color + '10' }}>
            {ach.issuer}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

const Achievements = () => {
  const [items, setItems] = useState(STATIC);
  useEffect(() => {
    api.get('/achievements').then(res => { if (res.data.data?.length) setItems(res.data.data); }).catch(() => {});
  }, []);
  return (
    <section id="achievements" className="section">
      <SectionHeader number={7} title="Achievements" subtitle="Milestones, recognitions, and accomplishments" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
        {items.map((a, i) => <AchievementCard key={a.id} ach={a} index={i} />)}
      </div>
    </section>
  );
};
export default Achievements;
