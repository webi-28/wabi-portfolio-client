import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaCalendar, FaMapMarkerAlt, FaCheckCircle } from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const TYPE_META = {
  academic:   { color: '#2563EB',  label: 'Academic'   },
  volunteer:  { color: '#EF4444',  label: 'Volunteer'  },
  internship: { color: '#10B981',  label: 'Internship' },
  freelance:  { color: '#F59E0B',  label: 'Freelance'  },
  full_time:  { color: '#8B5CF6',  label: 'Full Time'  },
  part_time:  { color: '#06B6D4',  label: 'Part Time'  },
};

const STATIC = [
  { id: 1, title: 'Final Year Academic Project Lead', organization: 'Haramaya University – IT Department', type: 'academic', location: 'Haramaya, Ethiopia', start_date: '2023-09', end_date: '2024-06', is_current: 0, description: 'Led the design and development of the Online Vacancy and Recruitment System as the capstone project.', responsibilities: ['Designed system architecture and database schema', 'Led a team of 4 developers', 'Implemented backend API using Laravel', 'Received Grade A from faculty panel'], technologies: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'] },
  { id: 2, title: 'Community Peace Volunteer', organization: 'Ministry of Peace, Ethiopia', type: 'volunteer', location: 'Haramaya, Ethiopia', start_date: '2023-06', end_date: '2023-08', is_current: 0, description: 'Participated in community outreach programs promoting peace, dialogue, and social harmony.', responsibilities: ['Organized community dialogue sessions', 'Created awareness materials', 'Engaged with 200+ community members'], technologies: [] },
  { id: 3, title: 'Self-Directed Software Development', organization: 'Personal Projects', type: 'academic', location: 'Remote', start_date: '2021-06', end_date: '2026-06', is_current: 0, description: 'Independently developed multiple software projects during academic studies.', responsibilities: ['Built 4+ complete software applications', 'Practiced full-stack web development', 'Documented all projects on GitHub'], technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP', 'Java', 'MySQL'] },
];

const ExpCard = ({ exp, index }) => {
  const meta  = TYPE_META[exp.type] || TYPE_META.academic;
  const resps = Array.isArray(exp.responsibilities) ? exp.responsibilities : [];
  const techs = Array.isArray(exp.technologies) ? exp.technologies : [];
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="relative flex gap-5"
    >
      {/* Timeline */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center border"
          style={{ backgroundColor: meta.color + '15', borderColor: meta.color + '40' }}>
          <FaBriefcase className="w-4 h-4" style={{ color: meta.color }} />
        </div>
        {index < STATIC.length - 1 && <div className="w-px flex-1 mt-2" style={{ background: `linear-gradient(to bottom, ${meta.color}40, transparent)` }} />}
      </div>

      {/* Card */}
      <div className="flex-1 card p-5 mb-6">
        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-white text-base">{exp.title}</h3>
            <p className="text-sm font-mono mt-0.5" style={{ color: meta.color }}>{exp.organization}</p>
          </div>
          <div className="flex flex-col items-end gap-1 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg capitalize border"
              style={{ color: meta.color, borderColor: meta.color + '30', backgroundColor: meta.color + '10' }}>
              {meta.label}
            </span>
            <span className="text-slate-600 flex items-center gap-1">
              <FaCalendar className="w-2.5 h-2.5" />
              {exp.start_date} → {exp.is_current ? 'Present' : exp.end_date}
            </span>
            {exp.location && <span className="text-slate-600 flex items-center gap-1"><FaMapMarkerAlt className="w-2.5 h-2.5" />{exp.location}</span>}
          </div>
        </div>

        <p className="text-slate-400 text-sm leading-relaxed mb-3">{exp.description}</p>

        {resps.length > 0 && (
          <ul className="space-y-1.5 mb-3">
            {resps.map(r => (
              <li key={r} className="flex items-start gap-2 text-xs text-slate-500">
                <FaCheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0" style={{ color: meta.color }} />
                {r}
              </li>
            ))}
          </ul>
        )}

        {techs.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {techs.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Experience = () => {
  const [items, setItems] = useState(STATIC);
  useEffect(() => {
    api.get('/experience').then(res => { if (res.data.data?.length) setItems(res.data.data); }).catch(() => {});
  }, []);
  return (
    <section id="experience" className="section bg-[#080F1E]/60">
      <SectionHeader number={6} title="Work Experience" subtitle="Academic projects, volunteer work, and practical experiences" />
      <div className="max-w-3xl mx-auto">
        {items.map((e, i) => <ExpCard key={e.id} exp={e} index={i} />)}
      </div>
    </section>
  );
};
export default Experience;
