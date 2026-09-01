import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { FaGithub, FaExternalLinkAlt, FaArrowLeft, FaCalendar, FaTag, FaCode } from 'react-icons/fa';
import api from '../services/api.js';
import Loader from '../components/common/Loader.jsx';

const STATIC_PROJECTS = {
  'cafeteria-management-system': {
    id: 1, slug: 'cafeteria-management-system', title: 'Cafeteria Management System',
    short_description: 'Full-stack web application for managing cafeteria operations.',
    description: 'A comprehensive cafeteria management system built to streamline daily operations at Haramaya University. The system enables staff to manage menu items, process customer orders, generate bills, and produce daily/weekly reports. Features include user authentication, role-based access control, inventory tracking, and financial reporting dashboards.',
    technologies: ['PHP', 'MySQL', 'Bootstrap', 'JavaScript', 'HTML5', 'CSS3', 'XAMPP'],
    category: 'web', status: 'completed', project_date: '2023-06-01',
    github_url: 'https://github.com/wabiworku/cafeteria-management', live_url: null,
  },
  'online-vacancy-recruitment-system': {
    id: 2, slug: 'online-vacancy-recruitment-system', title: 'Online Vacancy & Recruitment System',
    short_description: 'Web-based recruitment platform connecting employers with job seekers.',
    description: 'A full-featured online recruitment platform developed as a final-year academic project. The system allows employers to post vacancies, manage applications, and conduct screenings, while job seekers can create profiles, upload CVs, and apply for positions. Key features include email notifications, applicant tracking, and an admin dashboard.',
    technologies: ['PHP', 'Laravel', 'MySQL', 'Bootstrap', 'JavaScript', 'HTML5', 'CSS3'],
    category: 'web', status: 'completed', project_date: '2023-12-01',
    github_url: 'https://github.com/wabiworku/recruitment-system', live_url: null,
  },
  'hospital-management-system': {
    id: 3, slug: 'hospital-management-system', title: 'Hospital Management System',
    short_description: 'Desktop application for managing patient records, appointments, and prescriptions.',
    description: 'A robust hospital management system developed to digitize hospital operations. The application handles patient registration, appointment scheduling, doctor management, prescription records, billing, and inventory for medical supplies. Uses MySQL for secure data storage with role-based access for doctors, nurses, and admin staff.',
    technologies: ['Java', 'MySQL', 'JavaFX', 'JDBC'],
    category: 'desktop', status: 'completed', project_date: '2023-03-01',
    github_url: 'https://github.com/wabiworku/hospital-management', live_url: null,
  },
  'harar-tourism-website': {
    id: 4, slug: 'harar-tourism-website', title: 'Harar Tourism Website',
    short_description: 'Cultural tourism website showcasing historical sites of Harar, Ethiopia.',
    description: 'A visually appealing tourism website dedicated to promoting Harar, a UNESCO World Heritage Site. Features detailed information about historical landmarks, local cuisine, cultural events, accommodation, and travel guides. Includes an interactive gallery, contact forms for tour booking, and multilingual support for Amharic and English.',
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'PHP', 'MySQL'],
    category: 'web', status: 'completed', project_date: '2022-09-01',
    github_url: 'https://github.com/wabiworku/harar-tourism', live_url: null,
  },
};

const ProjectDetail = () => {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/projects/${slug}`)
      .then(res => setProject(res.data.data))
      .catch(() => setProject(STATIC_PROJECTS[slug] || null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader fullScreen={false} /></div>;
  if (!project) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-dark-muted text-xl">Project not found.</p>
      <Link to="/#projects" className="btn-primary"><FaArrowLeft className="w-4 h-4" /> Back to Projects</Link>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{project.title} | Wabi Worku</title>
        <meta name="description" content={project.short_description} />
      </Helmet>

      <div className="min-h-screen pt-24 pb-16 px-4 max-w-4xl mx-auto">
        {/* Back */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <Link to="/#projects" className="inline-flex items-center gap-2 text-dark-muted hover:text-primary transition-colors mb-8 group">
            <FaArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Projects
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
            <div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20 capitalize mb-3 inline-block">
                {project.category}
              </span>
              <h1 className="text-4xl md:text-5xl font-black gradient-text leading-tight">{project.title}</h1>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-secondary text-sm py-2 px-4">
                  <FaGithub className="w-4 h-4" /> GitHub
                </a>
              )}
              {project.live_url && (
                <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm py-2 px-4">
                  <FaExternalLinkAlt className="w-3.5 h-3.5" /> Live Demo
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Image */}
        {project.image && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="glass-card overflow-hidden h-72 mb-8">
            <img src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}${project.image}`} alt={project.title}
              className="w-full h-full object-cover" />
          </motion.div>
        )}

        {/* Meta */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="grid sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: FaTag, label: 'Category', value: project.category },
            { icon: FaCalendar, label: 'Date', value: project.project_date ? new Date(project.project_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A' },
            { icon: FaCode, label: 'Status', value: project.status },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass-card p-4 flex items-center gap-3">
              <Icon className="w-4 h-4 text-primary" />
              <div>
                <p className="text-dark-muted text-xs">{label}</p>
                <p className="text-white font-medium text-sm capitalize">{value}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Description */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Project Overview</h2>
            <p className="text-dark-muted leading-relaxed">{project.description}</p>
          </div>

          {/* Technologies */}
          <div className="glass-card p-6">
            <h2 className="text-xl font-bold text-white mb-4">Technologies Used</h2>
            <div className="flex flex-wrap gap-2">
              {(Array.isArray(project.technologies)
                ? project.technologies
                : (() => { try { return JSON.parse(project.technologies || '[]'); } catch { return []; } })()
              ).map(tech => (
                <span key={tech} className="px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-primary font-medium text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProjectDetail;
