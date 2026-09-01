import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaDownload, FaEnvelope, FaArrowDown, FaMapMarkerAlt } from 'react-icons/fa';
import { TypeAnimation } from 'react-type-animation';
import Particles from '../common/Particles.jsx';
import api from '../../services/api.js';

const DEFAULTS = {
  hero_name: 'Webi Worku Alemu',
  hero_roles: 'Information Technology Graduate,Full-Stack Developer,Network Administrator,Software Engineer',
  hero_bio: 'Motivated IT graduate from Haramaya University with a CGPA of 3.55/4.00. Skilled in web development, networking, database management, and IT support.',
  github_url: 'https://github.com/webi-28',
  linkedin_url: 'https://www.linkedin.com/in/webi-worku-a8737a352/',
  profile_image: '/assets/EVER7706.JPG',
  available_for_work: 'true',
  owner_cgpa: '3.55/4.00',
  owner_degree: 'BSc IT',
  owner_location: 'Addis Ababa, Ethiopia',
};

const Hero = () => {
  const [s, setS] = useState(DEFAULTS);

  useEffect(() => {
    api.get('/settings')
      .then(res => { if (res.data.data) setS(p => ({ ...p, ...res.data.data })); })
      .catch(() => {});
  }, []);

  const roles = (s.hero_roles || '').split(',').map(r => r.trim()).filter(Boolean);
  const typingSeq = roles.flatMap(r => [r, 2200]);

  const profileSrc = s.profile_image?.startsWith('/uploads')
    ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${s.profile_image}`
    : (s.profile_image || '/assets/EVER7706.JPG');

  const cvUrl = `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}/api/settings/cv/download`;
  const cgpa   = s.owner_cgpa || '3.55/4.00';
  const degree = s.owner_degree || 'BSc IT';
  const initials = (s.hero_name || 'WW').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const scrollTo = id => document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });

  const STATS = [
    { value: cgpa, label: 'CGPA' },
    { value: '4+', label: 'Projects' },
    { value: '3+', label: 'Certificates' },
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      <Particles />

      {/* Grid dots */}
      <div className="absolute inset-0 bg-dots opacity-30 pointer-events-none" />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -left-60 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(37,99,235,0.18) 0%, transparent 70%)' }} />
      <div className="absolute bottom-1/4 -right-60 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)' }} />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* ── LEFT ── */}
          <div>
            {/* Available badge */}
            {s.available_for_work === 'true' && (
              <motion.div
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-sm font-medium">Available for Work</span>
              </motion.div>
            )}

            {/* Name */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.08] tracking-tight mb-2">
                <span className="text-white">
                  {s.hero_name?.split(' ').slice(0, 1).join(' ') || 'Webi'}
                </span>
                <br />
                <span className="gradient-text">
                  {s.hero_name?.split(' ').slice(1).join(' ') || 'Worku Alemu'}
                </span>
              </h1>
            </motion.div>

            {/* Typing role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28 }}
              className="flex items-center gap-3 mt-4 mb-5"
            >
              <div className="flex gap-1">
                <div className="w-1 h-6 rounded-full bg-blue-500" />
                <div className="w-1 h-6 rounded-full bg-cyan-400 opacity-60" />
              </div>
              <div className="text-lg sm:text-xl font-semibold text-slate-300 min-h-[28px]">
                {typingSeq.length > 0 && (
                  <TypeAnimation
                    key={s.hero_roles}
                    sequence={typingSeq}
                    speed={55}
                    deletionSpeed={75}
                    repeat={Infinity}
                    wrapper="span"
                    className="gradient-text"
                  />
                )}
              </div>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="text-slate-400 text-base leading-relaxed max-w-lg mb-7"
            >
              {s.hero_bio}
            </motion.p>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.42 }}
              className="flex items-center gap-2 text-slate-500 text-sm mb-8"
            >
              <FaMapMarkerAlt className="w-3.5 h-3.5 text-blue-400" />
              <span>{s.owner_location || 'Addis Ababa, Ethiopia'}</span>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
              className="flex items-center gap-6 mb-8"
            >
              {STATS.map(({ value, label }, i) => (
                <div key={label} className="text-center">
                  <div className="text-2xl font-black gradient-text">{value}</div>
                  <div className="text-slate-500 text-xs mt-0.5">{label}</div>
                </div>
              ))}
              <div className="w-px h-10 bg-slate-800" />
              <div className="text-slate-500 text-xs leading-tight">
                <div className="text-slate-400 font-medium">Haramaya University</div>
                <div>IT Graduate</div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              <a
                href={cvUrl}
                download="WEBI-WORKU-ALEMU-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                <FaDownload className="w-3.5 h-3.5" />
                Download CV
              </a>
              <button onClick={() => scrollTo('#contact')} className="btn-outline">
                <FaEnvelope className="w-3.5 h-3.5" />
                Contact Me
              </button>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.62 }}
              className="flex items-center gap-3"
            >
              {[
                { href: s.github_url,   icon: FaGithub,   label: 'GitHub',   hoverColor: '#ffffff' },
                { href: s.linkedin_url, icon: FaLinkedin, label: 'LinkedIn', hoverColor: '#60A5FA' },
              ].filter(x => x.href).map(({ href, icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-slate-500 hover:text-white transition-all duration-300"
                  style={{ background: 'rgba(13,22,39,0.8)', border: '1px solid rgba(30,45,69,0.9)' }}
                  aria-label={label}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ── RIGHT — Profile Image ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              {/* Rotating decorative rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-8 rounded-full"
                style={{ border: '1.5px dashed rgba(37,99,235,0.2)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
                className="absolute -inset-14 rounded-full"
                style={{ border: '1px solid rgba(6,182,212,0.1)' }}
              />

              {/* Glow border only — no blur behind image */}

              {/* Profile image */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 rounded-3xl overflow-hidden"
                style={{ border: '2px solid rgba(37,99,235,0.35)', boxShadow: '0 0 60px rgba(37,99,235,0.25), 0 0 120px rgba(37,99,235,0.1)' }}>
                <img
                  src={profileSrc}
                  alt={s.hero_name}
                  className="w-full h-full object-cover object-top"
                  onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                />
                {/* Fallback */}
                <div className="absolute inset-0 hidden items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.25), rgba(6,182,212,0.15))' }}>
                  <span className="text-7xl font-black gradient-text">{initials}</span>
                </div>
              </div>

              {/* Floating cards removed */}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center mt-20"
        >
          <motion.button
            onClick={() => scrollTo('#about')}
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex flex-col items-center gap-2 text-slate-600 hover:text-blue-400 transition-colors group cursor-pointer"
            aria-label="Scroll down"
          >
            <div className="w-6 h-10 rounded-full border-2 border-slate-700/60 group-hover:border-blue-500/50 flex items-start justify-center pt-2 transition-colors">
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="w-1.5 h-1.5 rounded-full bg-blue-400"
              />
            </div>
            <FaArrowDown className="w-3 h-3" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
