import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaExternalLinkAlt, FaCalendar, FaTimes,
  FaDownload, FaShieldAlt, FaAward, FaExpand, FaImage
} from 'react-icons/fa';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const STATIC = [
  {
    id: 1,
    name: 'Ministry of Peace Volunteer Certificate',
    organization: 'Ministry of Peace, Ethiopia',
    issue_date: '2024-01-01',
    description: 'Recognized for active participation in national volunteer and community service initiatives.',
    credential_url: null,
    image: null,
  },
  {
    id: 2,
    name: 'Claude AI Fluency Certificate',
    organization: 'Anthropic',
    issue_date: '2024-01-10',
    description: 'Certificate demonstrating proficiency in working with Claude AI and AI-assisted development.',
    credential_url: 'https://anthropic.com',
    image: null,
  },
  {
    id: 3,
    name: 'Claude 101 Certificate',
    organization: 'Anthropic',
    issue_date: '2024-01-05',
    description: 'Foundational certificate covering basics of AI interaction and practical applications of large language models.',
    credential_url: 'https://anthropic.com',
    image: null,
  },
];

const COLORS = ['#3B82F6', '#06B6D4', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

const getImageUrl = (image) => {
  if (!image) return null;
  if (image.startsWith('http')) return image;
  return `${API_BASE}${image}`;
};

/* ── Certificate Card ───────────────────────────────────────── */
const CertCard = ({ cert, index, onClick }) => {
  const color    = COLORS[index % COLORS.length];
  const imageUrl = getImageUrl(cert.image);
  const [imgErr, setImgErr] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      className="card cursor-pointer group relative overflow-hidden flex flex-col"
    >
      {/* Top color accent */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
      />

      {/* ── Certificate Image Preview ── */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: 160, background: `linear-gradient(135deg, ${color}10, var(--bg-card))` }}
      >
        {imageUrl && !imgErr ? (
          <>
            <img
              src={imageUrl}
              alt={cert.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgErr(true)}
            />
            {/* Dark overlay on hover showing "View" */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
                <FaExpand className="w-3.5 h-3.5" /> View Certificate
              </div>
            </div>
          </>
        ) : (
          /* Placeholder when no image */
          <div className="w-full h-full flex flex-col items-center justify-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}
            >
              <FaImage className="w-7 h-7" style={{ color, opacity: 0.5 }} />
            </div>
            <span className="text-xs text-slate-600">No image uploaded</span>
          </div>
        )}
      </div>

      {/* ── Card Info ── */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}15`, border: `1px solid ${color}25` }}
          >
            <FaAward className="w-4 h-4" style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-sm leading-snug mb-1 group-hover:text-blue-300 transition-colors"
              style={{ color: 'var(--text)' }}
            >
              {cert.name}
            </h3>
            <p className="text-xs font-semibold mb-2" style={{ color }}>
              {cert.organization}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                <FaCalendar className="w-2.5 h-2.5" />
                {new Date(cert.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
              {cert.credential_url && (
                <span
                  className="text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                  style={{ color: '#60A5FA' }}
                >
                  <FaExternalLinkAlt className="w-2.5 h-2.5" /> Verify
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Modal ──────────────────────────────────────────────────── */
const Modal = ({ cert, index, onClose }) => {
  const color    = COLORS[index % COLORS.length];
  const imageUrl = getImageUrl(cert.image);
  const [imgErr, setImgErr]       = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="card w-full relative overflow-hidden"
        style={{ maxWidth: 520 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Top accent */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, ${color}, transparent)` }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-xl flex items-center justify-center transition-all"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--bg-border)', color: 'var(--text-muted)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <FaTimes className="w-3.5 h-3.5" />
        </button>

        {/* ── Certificate Image (large) ── */}
        {imageUrl && !imgErr ? (
          <div className="relative" style={{ height: 260 }}>
            <img
              src={imageUrl}
              alt={cert.name}
              className="w-full h-full object-contain cursor-zoom-in"
              style={{ background: 'rgba(0,0,0,0.3)' }}
              onError={() => setImgErr(true)}
              onClick={() => setFullscreen(true)}
              title="Click to view full size"
            />
            {/* Expand hint */}
            <button
              onClick={() => setFullscreen(true)}
              className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <FaExpand className="w-3 h-3" /> Full View
            </button>
          </div>
        ) : (
          /* No image placeholder */
          <div
            className="flex items-center justify-center"
            style={{ height: 120, background: `linear-gradient(135deg, ${color}12, var(--bg-card))` }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: `${color}18`, border: `1px solid ${color}35` }}
            >
              <FaShieldAlt className="w-7 h-7" style={{ color }} />
            </div>
          </div>
        )}

        {/* ── Info ── */}
        <div className="p-5">
          <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text)' }}>
            {cert.name}
          </h3>
          <p className="font-semibold text-sm mb-1" style={{ color }}>
            {cert.organization}
          </p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>
            Issued:{' '}
            {new Date(cert.issue_date).toLocaleDateString('en-US', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>

          {cert.description && (
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
              {cert.description}
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3">
            {cert.credential_url && (
              <a
                href={cert.credential_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 justify-center"
                style={{ fontSize: 12, padding: '10px 16px' }}
              >
                <FaExternalLinkAlt className="w-3 h-3" /> Verify Credential
              </a>
            )}
            {imageUrl && !imgErr && (
              <a
                href={imageUrl}
                download={`${cert.name}.jpg`}
                className="btn-outline flex-1 justify-center"
                style={{ fontSize: 12, padding: '10px 16px' }}
              >
                <FaDownload className="w-3 h-3" /> Download
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Full Screen Image Viewer ── */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.95)' }}
            onClick={() => setFullscreen(false)}
          >
            <motion.img
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              src={imageUrl}
              alt={cert.name}
              className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl"
              style={{ maxHeight: '90vh', maxWidth: '90vw' }}
              onClick={e => e.stopPropagation()}
            />
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              <FaTimes className="w-4 h-4" />
            </button>
            <p className="absolute bottom-4 text-slate-400 text-xs">
              Click anywhere to close
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── Main Section ───────────────────────────────────────────── */
const Certifications = () => {
  const [certs, setCerts]       = useState(STATIC);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/certificates')
      .then(r => { if (r.data.data?.length) setCerts(r.data.data); })
      .catch(() => {});
  }, []);

  const selIndex = certs.findIndex(c => c.id === selected?.id);

  return (
    <section id="certifications" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <SectionHeader
        title="My Certifications"
        subtitle="Click any certificate to view the full image and details"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {certs.map((c, i) => (
          <CertCard
            key={c.id}
            cert={c}
            index={i}
            onClick={() => setSelected(c)}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && (
          <Modal
            cert={selected}
            index={selIndex}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default Certifications;
