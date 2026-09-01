import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaCode, FaCertificate, FaTools, FaEnvelope,
  FaExclamationCircle, FaArrowRight, FaChartBar
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';

const StatCard = ({ icon: Icon, label, value, color, to, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -4 }}
    className="glass-card p-5"
  >
    <div className="flex items-center justify-between mb-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '20' }}>
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      <Link to={to} className="text-dark-muted hover:text-primary transition-colors">
        <FaArrowRight className="w-4 h-4" />
      </Link>
    </div>
    <p className="text-3xl font-black text-white mb-1">{value ?? '—'}</p>
    <p className="text-dark-muted text-sm">{label}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/messages/stats')
      .then(res => setStats(res.data.data))
      .catch(() => setStats({ projects: '—', certificates: '—', skills: '—', messages: '—', unreadMessages: 0 }))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: FaCode, label: 'Total Projects', value: stats?.projects, color: '#2563EB', to: '/admin/projects' },
    { icon: FaCertificate, label: 'Certificates', value: stats?.certificates, color: '#06B6D4', to: '/admin/certificates' },
    { icon: FaTools, label: 'Skills', value: stats?.skills, color: '#10B981', to: '/admin/skills' },
    { icon: FaEnvelope, label: 'Total Messages', value: stats?.messages, color: '#8B5CF6', to: '/admin/messages' },
  ];

  return (
    <div>
      {/* Welcome */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
        </h1>
        <p className="text-dark-muted text-sm">Here's your portfolio overview</p>
      </motion.div>

      {/* Unread alert */}
      {stats?.unreadMessages > 0 && (
        <motion.div
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3"
        >
          <FaExclamationCircle className="text-yellow-400 w-5 h-5 flex-shrink-0" />
          <p className="text-yellow-300 text-sm">
            You have <strong>{stats.unreadMessages}</strong> unread message{stats.unreadMessages !== 1 ? 's' : ''}.{' '}
            <Link to="/admin/messages" className="underline hover:text-yellow-200">View Messages →</Link>
          </p>
        </motion.div>
      )}

      {/* Stats Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-card p-5 h-32 animate-pulse">
              <div className="w-12 h-12 rounded-xl bg-dark-border/30 mb-4" />
              <div className="h-7 w-16 bg-dark-border/30 rounded mb-2" />
              <div className="h-4 w-24 bg-dark-border/20 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {cards.map((c, i) => <StatCard key={c.label} {...c} delay={i * 0.1} />)}
        </div>
      )}

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <FaChartBar className="text-primary w-4 h-4" /> Quick Actions
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { label: 'Add New Project', to: '/admin/projects', color: '#2563EB' },
            { label: 'Add Certificate', to: '/admin/certificates', color: '#06B6D4' },
            { label: 'Manage Skills', to: '/admin/skills', color: '#10B981' },
            { label: 'Add Experience', to: '/admin/experience', color: '#F59E0B' },
            { label: 'View Messages', to: '/admin/messages', color: '#8B5CF6' },
            { label: 'Add Achievement', to: '/admin/achievements', color: '#EF4444' },
          ].map(({ label, to, color }) => (
            <Link key={to} to={to}
              className="glass-card p-4 flex items-center justify-between group hover:border-opacity-50 transition-all"
              style={{ '--hover-color': color }}
            >
              <span className="text-dark-muted group-hover:text-white text-sm font-medium transition-colors">{label}</span>
              <FaArrowRight className="w-3.5 h-3.5 text-dark-muted group-hover:text-primary transition-colors group-hover:translate-x-1 duration-200" />
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
