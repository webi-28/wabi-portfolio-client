import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiColorSwatch } from 'react-icons/hi';
import { FaCheck } from 'react-icons/fa';
import { useTheme, THEMES } from '../../context/ThemeContext.jsx';

const ThemeSwitcher = () => {
  const { themeId, setTheme, theme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSelect = (id) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        onClick={() => setOpen(o => !o)}
        className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
        style={{
          background: 'var(--bg-card)',
          border: `1px solid var(--bg-border)`,
          color: 'var(--text-muted)',
          boxShadow: open ? `0 0 12px ${theme.primary}50` : 'none',
        }}
        aria-label="Change theme"
        title="Change theme"
      >
        <HiColorSwatch style={{ width: 16, height: 16, color: theme.primary }} />
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -8 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute right-0 mt-2 z-[9999]"
            style={{ width: 220 }}
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid var(--bg-border)`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px ${theme.primary}20`,
              }}
            >
              {/* Header */}
              <div className="px-4 py-3" style={{ borderBottom: `1px solid var(--bg-border)` }}>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  Choose Theme
                </p>
              </div>

              {/* Theme list */}
              <div className="p-2 space-y-0.5">
                {Object.values(THEMES).map((t) => {
                  const isActive = themeId === t.id;
                  return (
                    <motion.button
                      key={t.id}
                      whileHover={{ x: 3 }}
                      onClick={() => handleSelect(t.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group"
                      style={{
                        background: isActive ? `${t.primary}18` : 'transparent',
                        border: `1px solid ${isActive ? t.primary + '40' : 'transparent'}`,
                      }}
                    >
                      {/* Color preview dots */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <div className="w-4 h-4 rounded-full border-2 border-white/10"
                          style={{ background: t.bg }} />
                        <div className="w-3 h-3 rounded-full"
                          style={{ background: t.primary }} />
                        <div className="w-2.5 h-2.5 rounded-full"
                          style={{ background: t.secondary }} />
                      </div>

                      {/* Name */}
                      <div className="flex-1 text-left">
                        <span className="text-sm font-medium"
                          style={{ color: isActive ? t.primary : 'var(--text)' }}>
                          {t.emoji} {t.name}
                        </span>
                      </div>

                      {/* Active checkmark */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: t.primary }}
                        >
                          <FaCheck style={{ width: 8, height: 8, color: '#fff' }} />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5" style={{ borderTop: `1px solid var(--bg-border)` }}>
                <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                  Theme is saved automatically
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
