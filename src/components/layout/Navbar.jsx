import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';
import { HiCode } from 'react-icons/hi';
import { useTheme } from '../../context/ThemeContext.jsx';
import ThemeSwitcher from '../common/ThemeSwitcher.jsx';

const LINKS = [
  { label: 'Home',          href: '#home' },
  { label: 'About',         href: '#about' },
  { label: 'Skills',        href: '#skills' },
  { label: 'Projects',      href: '#projects' },
  { label: 'Education',     href: '#education' },
  { label: 'Certifications',href: '#certifications' },
  { label: 'Experience',    href: '#experience' },
  { label: 'Contact',       href: '#contact' },
];

const Navbar = () => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive]     = useState('home');

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    document.querySelectorAll('section[id]').forEach(s => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = href => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: scrolled
            ? `color-mix(in srgb, var(--bg) 92%, transparent)`
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid var(--bg-border)` : 'none',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.3)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">

          {/* ── Logo ── */}
          <motion.button
            onClick={() => scrollTo('#home')}
            whileHover={{ scale: 1.04 }}
            className="flex items-center gap-2.5"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                boxShadow: `0 0 16px ${theme.primary}55`,
              }}
            >
              <HiCode style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <div>
              <span className="font-bold text-base tracking-tight" style={{ color: 'var(--text)' }}>Webi</span>
              <span className="gradient-text font-bold text-base tracking-tight">.dev</span>
            </div>
          </motion.button>

          {/* ── Desktop links ── */}
          <div className="hidden lg:flex items-center gap-1">
            {LINKS.map(({ label, href }) => {
              const isActive = active === href.slice(1);
              return (
                <button
                  key={href}
                  onClick={() => scrollTo(href)}
                  className="relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200"
                  style={{
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    background: isActive
                      ? `color-mix(in srgb, var(--primary) 12%, transparent)`
                      : 'transparent',
                  }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.color = 'var(--text)'; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.color = 'var(--text-muted)'; }}
                >
                  {label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-xl -z-10"
                      style={{ background: `color-mix(in srgb, var(--primary) 12%, transparent)` }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Right controls ── */}
          <div className="flex items-center gap-2">
            {/* Theme switcher — replaces old toggle */}
            <ThemeSwitcher />

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden w-9 h-9 rounded-xl flex items-center justify-center transition-all"
              style={{
                border: '1px solid var(--bg-border)',
                background: 'var(--bg-card)',
                color: 'var(--text-muted)',
              }}
              aria-label="Menu"
            >
              {menuOpen ? <FaTimes className="w-4 h-4" /> : <FaBars className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 lg:hidden"
              style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 lg:hidden flex flex-col"
              style={{
                background: 'var(--bg)',
                borderLeft: '1px solid var(--bg-border)',
              }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between p-5"
                style={{ borderBottom: '1px solid var(--bg-border)' }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                  >
                    <HiCode style={{ width: 14, height: 14, color: '#fff' }} />
                  </div>
                  <span className="font-bold text-sm" style={{ color: 'var(--text)' }}>
                    Webi<span className="gradient-text">.dev</span>
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  style={{ color: 'var(--text-muted)' }}
                  className="hover:opacity-80 transition-opacity"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {LINKS.map(({ label, href }, i) => {
                  const isActive = active === href.slice(1);
                  return (
                    <motion.button
                      key={href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => scrollTo(href)}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all"
                      style={{
                        color: isActive ? 'var(--text)' : 'var(--text-muted)',
                        background: isActive
                          ? `color-mix(in srgb, var(--primary) 15%, transparent)`
                          : 'transparent',
                        border: `1px solid ${isActive
                          ? `color-mix(in srgb, var(--primary) 35%, transparent)`
                          : 'transparent'}`,
                      }}
                    >
                      {label}
                    </motion.button>
                  );
                })}
              </nav>

              {/* Drawer theme switcher */}
              <div
                className="p-5 flex items-center justify-between"
                style={{ borderTop: '1px solid var(--bg-border)' }}
              >
                <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
                  Change Theme
                </span>
                <ThemeSwitcher />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
