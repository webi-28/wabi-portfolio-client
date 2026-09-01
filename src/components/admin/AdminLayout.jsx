import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTachometerAlt, FaCode, FaCertificate, FaTools, FaBriefcase,
  FaTrophy, FaEnvelope, FaSignOutAlt, FaBars, FaTimes, FaUser,
  FaChevronRight, FaGraduationCap, FaLanguage, FaIdCard
} from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext.jsx';
import { toast } from 'react-toastify';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FaTachometerAlt, end: true },
  { to: '/admin/profile', label: 'Profile & Hero', icon: FaIdCard },
  { to: '/admin/projects', label: 'Projects', icon: FaCode },
  { to: '/admin/skills', label: 'Skills', icon: FaTools },
  { to: '/admin/certificates', label: 'Certificates', icon: FaCertificate },
  { to: '/admin/education', label: 'Education', icon: FaGraduationCap },
  { to: '/admin/experience', label: 'Experience', icon: FaBriefcase },
  { to: '/admin/achievements', label: 'Achievements', icon: FaTrophy },
  { to: '/admin/languages', label: 'Languages', icon: FaLanguage },
  { to: '/admin/messages', label: 'Messages', icon: FaEnvelope },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.info('Logged out successfully');
    navigate('/admin/login');
  };

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : 'w-64'}`}>
      {/* Logo */}
      <div className="p-6 border-b border-dark-border/30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <FaCode className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm">Admin Panel</p>
            <p className="text-dark-muted text-xs">Wabi Worku Portfolio</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => mobile && setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? 'bg-primary text-white shadow-glow-primary'
                  : 'text-dark-muted hover:text-white hover:bg-white/5'
              }`
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            <span>{label}</span>
            <FaChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-50 transition-opacity" />
          </NavLink>
        ))}
      </nav>

      {/* User */}
      <div className="p-4 border-t border-dark-border/30">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-bg/40 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <FaUser className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-dark-muted text-xs truncate">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-dark-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <FaSignOutAlt className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-bg flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-dark-card/50 border-r border-dark-border/30 fixed inset-y-0 left-0 z-30">
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 left-0 w-64 bg-dark-card border-r border-dark-border/30 z-50 lg:hidden flex flex-col"
            >
              <Sidebar mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-dark-card/80 backdrop-blur-sm border-b border-dark-border/30 h-16 flex items-center px-4 md:px-6 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden w-9 h-9 rounded-xl border border-dark-border/50 flex items-center justify-center text-dark-muted hover:text-white transition-colors"
          >
            <FaBars className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 text-dark-muted text-sm ml-auto">
            <NavLink to="/" target="_blank" className="hover:text-primary transition-colors text-xs">
              View Portfolio ↗
            </NavLink>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
