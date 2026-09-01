import { FaGithub, FaLinkedin, FaHeart } from 'react-icons/fa';
import { HiCode } from 'react-icons/hi';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';

const Footer = () => {
  const { theme } = useTheme();
  const year = new Date().getFullYear();
  const scrollTo = href => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer style={{ borderTop: '1px solid var(--bg-border)', background: 'var(--bg-card)' }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
                  boxShadow: `0 0 16px ${theme.primary}44`,
                }}>
                <HiCode style={{ width: 18, height: 18, color: '#fff' }} />
              </div>
              <span className="font-bold text-base" style={{ color: 'var(--text)' }}>
                Webi<span className="gradient-text">.dev</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
              IT Graduate &amp; Full-Stack Developer building impactful digital solutions from Ethiopia.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(16,185,129,0.08)',
                border: '1px solid rgba(16,185,129,0.25)',
                color: '#34D399',
              }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Open to Work
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Navigation</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {[['#home','Home'],['#about','About'],['#skills','Skills'],
                ['#projects','Projects'],['#education','Education'],['#contact','Contact']
              ].map(([href, label]) => (
                <button key={href} onClick={() => scrollTo(href)}
                  className="text-left text-sm transition-colors py-0.5"
                  style={{ color: 'var(--text-muted)' }}
                  onMouseEnter={e => e.currentTarget.style.color = theme.primary}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-sm mb-4" style={{ color: 'var(--text)' }}>Connect With Me</h4>
            <div className="flex gap-3 mb-4">
              {[
                { icon: FaGithub,   href: 'https://github.com/webi-28',                       label: 'GitHub'   },
                { icon: FaLinkedin, href: 'https://www.linkedin.com/in/webi-worku-a8737a352/', label: 'LinkedIn' },
              ].map(({ icon: Icon, href, label }) => (
                <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
                  style={{
                    border: '1px solid var(--bg-border)',
                    background: 'var(--bg)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = theme.primary}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                  aria-label={label}>
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>wworku28@gmail.com</p>
          </div>
        </div>

        <div className="divider mb-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            &copy; {year} Webi Worku Alemu. All rights reserved.
          </p>
          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
            Made with <FaHeart className="w-3 h-3 text-red-400" /> in Ethiopia
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
