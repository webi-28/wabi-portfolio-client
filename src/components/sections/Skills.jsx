import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaJava, FaPython, FaGit, FaGithub, FaDatabase, FaServer, FaCode, FaLock, FaPlug, FaExchangeAlt, FaShieldAlt } from 'react-icons/fa';
import { SiJavascript, SiTailwindcss, SiBootstrap, SiExpress, SiPhp, SiLaravel, SiCplusplus, SiDotnet, SiMysql, SiPostgresql, SiMongodb, SiSqlite, SiXampp, SiVmware, SiPostman } from 'react-icons/si';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const ICON_MAP = {
  FaHtml5, FaCss3Alt, FaReact, FaNodeJs, FaJava, FaPython, FaGit, FaGithub,
  FaDatabase, FaServer, FaCode, FaLock, FaPlug, FaExchangeAlt, FaShieldAlt,
  SiJavascript, SiTailwindcss, SiBootstrap, SiExpress, SiPhp, SiLaravel,
  SiCplusplus, SiDotnet, SiMysql, SiPostgresql, SiMongodb, SiSqlite,
  SiXampp, SiVmware, SiPostman,
  // Aliases for DB icons mapped to API skills
  FaVial: FaCode, FaFileAlt: FaCode,
};
const CATS = ['all', 'frontend', 'backend', 'programming', 'database', 'tools', 'api'];
const STATIC = [
  { id: 1,  name: 'HTML5',       category: 'frontend',    proficiency: 92, icon: 'FaHtml5',      color: '#E34F26' },
  { id: 2,  name: 'CSS3',        category: 'frontend',    proficiency: 88, icon: 'FaCss3Alt',    color: '#1572B6' },
  { id: 3,  name: 'JavaScript',  category: 'frontend',    proficiency: 85, icon: 'SiJavascript', color: '#F7DF1E' },
  { id: 4,  name: 'React.js',    category: 'frontend',    proficiency: 82, icon: 'FaReact',      color: '#61DAFB' },
  { id: 5,  name: 'Bootstrap',   category: 'frontend',    proficiency: 80, icon: 'SiBootstrap',  color: '#7952B3' },
  { id: 6,  name: 'Tailwind CSS',category: 'frontend',    proficiency: 80, icon: 'SiTailwindcss',color: '#06B6D4' },
  { id: 7,  name: 'Node.js',     category: 'backend',     proficiency: 78, icon: 'FaNodeJs',     color: '#339933' },
  { id: 8,  name: 'Express.js',  category: 'backend',     proficiency: 78, icon: 'SiExpress',    color: '#68A063' },
  { id: 9,  name: 'PHP',         category: 'backend',     proficiency: 72, icon: 'SiPhp',        color: '#777BB4' },
  { id: 10, name: 'Laravel',     category: 'backend',     proficiency: 68, icon: 'SiLaravel',    color: '#FF2D20' },
  { id: 11, name: 'Java',        category: 'programming', proficiency: 75, icon: 'FaJava',       color: '#007396' },
  { id: 12, name: 'Python',      category: 'programming', proficiency: 78, icon: 'FaPython',     color: '#3776AB' },
  { id: 13, name: 'C++',         category: 'programming', proficiency: 70, icon: 'SiCplusplus',  color: '#00599C' },
  { id: 14, name: 'C#',          category: 'programming', proficiency: 68, icon: 'SiDotnet',     color: '#239120' },
  { id: 15, name: 'MySQL',       category: 'database',    proficiency: 82, icon: 'SiMysql',      color: '#4479A1' },
  { id: 16, name: 'PostgreSQL',  category: 'database',    proficiency: 72, icon: 'SiPostgresql', color: '#336791' },
  { id: 17, name: 'MongoDB',     category: 'database',    proficiency: 68, icon: 'SiMongodb',    color: '#47A248' },
  { id: 18, name: 'SQLite',      category: 'database',    proficiency: 75, icon: 'SiSqlite',     color: '#003B57' },
  { id: 19, name: 'Git',         category: 'tools',       proficiency: 85, icon: 'FaGit',        color: '#F05032' },
  { id: 20, name: 'GitHub',      category: 'tools',       proficiency: 85, icon: 'FaGithub',     color: '#9CA3AF' },
  { id: 21, name: 'VS Code',     category: 'tools',       proficiency: 92, icon: 'FaCode',       color: '#007ACC' },
  { id: 22, name: 'XAMPP',       category: 'tools',       proficiency: 80, icon: 'SiXampp',      color: '#FB7A24' },
  { id: 23, name: 'VMware',      category: 'tools',       proficiency: 65, icon: 'SiVmware',     color: '#607078' },
  // API Development Skills
  { id: 24, name: 'RESTful API Development',     category: 'api', proficiency: 82, icon: 'FaServer',      color: '#2563EB' },
  { id: 25, name: 'API Design & Documentation',  category: 'api', proficiency: 78, icon: 'FaCode',        color: '#06B6D4' },
  { id: 26, name: 'CRUD API Development',        category: 'api', proficiency: 85, icon: 'FaDatabase',    color: '#8B5CF6' },
  { id: 27, name: 'JSON Data Exchange',          category: 'api', proficiency: 88, icon: 'FaCode',        color: '#10B981' },
  { id: 28, name: 'API Testing (Postman)',        category: 'api', proficiency: 80, icon: 'SiPostman',     color: '#FF6C37' },
  { id: 29, name: 'JWT Authentication',          category: 'api', proficiency: 78, icon: 'FaLock',        color: '#EF4444' },
  { id: 30, name: 'HTTP Methods',                category: 'api', proficiency: 90, icon: 'FaExchangeAlt', color: '#3B82F6' },
  { id: 31, name: 'Error Handling & Validation', category: 'api', proficiency: 82, icon: 'FaShieldAlt',   color: '#06B6D4' },
  { id: 32, name: 'API Integration',             category: 'api', proficiency: 78, icon: 'FaPlug',        color: '#A855F7' },
];

const SkillCard = ({ skill, index }) => {
  const Icon = ICON_MAP[skill.icon] || FaDatabase;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.035 }}
      whileHover={{ y: -4 }}
      className="card-hover p-4"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${skill.color}15`, border: `1px solid ${skill.color}25` }}>
          <Icon className="w-5 h-5" style={{ color: skill.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-white font-semibold text-sm">{skill.name}</span>
            <span className="text-xs font-bold" style={{ color: skill.color }}>{skill.proficiency}%</span>
          </div>
          <span className="text-slate-600 text-xs capitalize">{skill.category}</span>
        </div>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(30,45,69,0.8)' }}>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.proficiency}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.035, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${skill.color}, ${skill.color}60)` }}
        />
      </div>
    </motion.div>
  );
};

const Skills = () => {
  const [skills, setSkills] = useState(STATIC);
  const [active, setActive] = useState('all');

  useEffect(() => {
    api.get('/skills').then(r => { const l = r.data.data?.skills; if (l?.length) setSkills(l); }).catch(() => {});
  }, []);

  const filtered = active === 'all' ? skills : skills.filter(s => s.category === active);

  return (
    <section id="skills" className="py-24 px-4 md:px-8 max-w-7xl mx-auto" style={{ background: 'rgba(8,15,30,0.4)' }}>
      <SectionHeader title="Technical Skills" subtitle="A comprehensive overview of my technical expertise and proficiency levels" />

      {/* Filter tabs — centered */}
      <div className="flex gap-2 flex-wrap mb-8 justify-center">
        {CATS.map(cat => (
          <motion.button key={cat} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            onClick={() => setActive(cat)}
            className="px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all border"
            style={{
              background: active === cat ? 'rgba(37,99,235,0.18)' : 'rgba(13,22,39,0.8)',
              borderColor: active === cat ? 'rgba(37,99,235,0.5)' : 'rgba(30,45,69,0.8)',
              color: active === cat ? '#93C5FD' : '#475569',
              boxShadow: active === cat ? '0 0 14px rgba(37,99,235,0.2)' : 'none',
            }}>
            {cat}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((s, i) => <SkillCard key={s.id} skill={s} index={i} />)}
      </div>
    </section>
  );
};
export default Skills;
