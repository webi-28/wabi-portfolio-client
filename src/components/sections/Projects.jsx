import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaSearch, FaCode, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const CATS = ['all', 'web', 'mobile', 'desktop', 'api'];
const STATIC = [
  { id: 1, slug: 'cafeteria-management-system', title: 'Cafeteria Management System', short_description: 'Full-stack web app to manage cafeteria operations — menu, orders, billing, and reporting.', technologies: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript'], category: 'web', is_featured: true, github_url: 'https://github.com/wabiworku/cafeteria-management' },
  { id: 2, slug: 'online-vacancy-recruitment-system', title: 'Online Vacancy & Recruitment System', short_description: 'Web-based recruitment platform connecting employers with job seekers through automated application management.', technologies: ['PHP', 'Laravel', 'MySQL', 'Bootstrap'], category: 'web', is_featured: true, github_url: 'https://github.com/wabiworku/recruitment-system' },
  { id: 3, slug: 'hospital-management-system', title: 'Hospital Management System', short_description: 'Desktop application for managing patient records, appointments, prescriptions, and hospital operations.', technologies: ['Java', 'MySQL', 'JavaFX'], category: 'desktop', is_featured: true, github_url: 'https://github.com/wabiworku/hospital-management' },
  { id: 4, slug: 'harar-tourism-website', title: 'Harar Tourism Website', short_description: 'Cultural tourism website showcasing the historical sites and attractions of Harar, Ethiopia.', technologies: ['HTML5', 'CSS3', 'JavaScript', 'PHP'], category: 'web', is_featured: true, github_url: 'https://github.com/wabiworku/harar-tourism' },
];

const COLORS = { web: '#2563EB', desktop: '#8B5CF6', mobile: '#10B981', api: '#F59E0B', other: '#64748B' };

// Safely parse technologies — handles both string JSON and real arrays
const parseTech = (t) => {
  if (!t) return [];
  if (Array.isArray(t)) return t;
  try { return JSON.parse(t); } catch { return []; }
};

const ProjectCard = ({ project, index }) => {
  const color = COLORS[project.category] || COLORS.other;
  const techs = parseTech(project.technologies);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className="card group flex flex-col overflow-hidden"
    >
      {/* Top accent */}
      <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />

      {/* Image / placeholder */}
      <div className="relative h-44 overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}12, #0D1627)` }}>
        {project.image
          ? <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${project.image}`} alt={project.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
          : (
            <div className="w-full h-full flex items-center justify-center">
              <FaCode className="w-14 h-14 opacity-10" style={{ color }} />
            </div>
          )
        }
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1627] via-transparent to-transparent" />
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 text-xs font-mono rounded-lg border capitalize"
            style={{ color, borderColor: color + '40', backgroundColor: color + '15' }}>
            {project.category}
          </span>
        </div>
        {project.is_featured === 1 && (
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 text-xs font-mono rounded-lg bg-yellow-400/10 border border-yellow-400/30 text-yellow-400">⭐ Featured</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-white text-base mb-2 group-hover:text-cyan-400 transition-colors leading-snug">{project.title}</h3>
        <p className="text-slate-500 text-xs leading-relaxed flex-1 mb-4">{project.short_description}</p>

        {/* Tech stack */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {techs.slice(0, 4).map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
          {techs.length > 4 && (
            <span className="tag">+{techs.length - 4}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link to={`/projects/${project.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium text-slate-400 border border-slate-700/60 hover:text-white hover:border-primary/50 transition-all">
            View Details <FaArrowRight className="w-2.5 h-2.5" />
          </Link>
          {project.github_url && (
            <motion.a href={project.github_url} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-500 hover:text-white transition-colors">
              <FaGithub className="w-3.5 h-3.5" />
            </motion.a>
          )}
          {project.live_url && (
            <motion.a href={project.live_url} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/60 flex items-center justify-center text-slate-500 hover:text-cyan-400 transition-colors">
              <FaExternalLinkAlt className="w-3 h-3" />
            </motion.a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Projects = () => {
  const [projects, setProjects] = useState(STATIC);
  const [filtered, setFiltered] = useState(STATIC);
  const [cat, setCat]           = useState('all');
  const [search, setSearch]     = useState('');
  const [page, setPage]         = useState(1);
  const [totalPages, setTotal]  = useState(1);

  const fetch = useCallback(async () => {
    try {
      const res = await api.get('/projects', { params: { page, limit: 6, ...(cat !== 'all' && { category: cat }), ...(search && { search }) } });
      if (res.data.data?.projects?.length) { setProjects(res.data.data.projects); setTotal(res.data.data.pagination?.pages || 1); }
    } catch {}
  }, [page, cat, search]);

  useEffect(() => { fetch(); }, [fetch]);

  useEffect(() => {
    let r = projects;
    if (cat !== 'all') r = r.filter(p => p.category === cat);
    if (search) r = r.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.short_description?.toLowerCase().includes(search.toLowerCase()));
    setFiltered(r);
  }, [projects, cat, search]);

  return (
    <section id="projects" className="section">
      <SectionHeader number={3} title="Featured Projects" subtitle="A collection of academic and personal projects showcasing my technical skills" />

      {/* Filters — centered */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 justify-center items-center">
        <div className="relative flex-1 max-w-sm">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 w-3.5 h-3.5" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." className="input pl-10" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATS.map(c => (
            <button key={c} onClick={() => { setCat(c); setPage(1); }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono capitalize transition-all border ${
                cat === c ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-slate-900/60 border-slate-700/50 text-slate-500 hover:text-white'
              }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-slate-600">
            <FaCode className="w-14 h-14 mx-auto mb-3 opacity-20" />
            <p>No projects found.</p>
          </motion.div>
        ) : (
          <motion.div key="grid" className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
          </motion.div>
        )}
      </AnimatePresence>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-mono transition-all border ${page === p ? 'bg-primary text-white border-primary' : 'border-slate-700/60 text-slate-500 hover:text-white'}`}>
              {p}
            </button>
          ))}
        </div>
      )}
    </section>
  );
};

export default Projects;
