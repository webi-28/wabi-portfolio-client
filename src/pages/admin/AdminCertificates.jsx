import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaPlus, FaEdit, FaTrash, FaTimes, FaSave,
  FaCertificate, FaExternalLinkAlt, FaImage
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
const EMPTY = {
  name: '', organization: '', issue_date: '', expiry_date: '',
  credential_id: '', credential_url: '', description: '', skills: '', sort_order: 0,
};

/* ── Add / Edit Modal ──────────────────────────────────── */
const Modal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState(
    item
      ? { ...item, skills: Array.isArray(item.skills) ? item.skills.join(', ') : (item.skills || '') }
      : EMPTY
  );
  const [saving, setSaving]     = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview]   = useState(
    item?.image
      ? (item.image.startsWith('http') ? item.image : `${API_BASE}${item.image}`)
      : null
  );

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.organization || !form.issue_date) {
      toast.error('Name, organization and issue date are required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      const skills = form.skills.split(',').map(s => s.trim()).filter(Boolean);
      Object.entries({ ...form, skills: JSON.stringify(skills) }).forEach(([k, v]) => {
        if (v !== null && v !== undefined && v !== '') fd.append(k, v);
      });
      if (imageFile) fd.append('image', imageFile);

      if (item?.id) {
        await api.put(`/certificates/${item.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Certificate updated');
      } else {
        await api.post('/certificates', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Certificate created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card p-6 w-full max-w-lg my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text)' }}>
            {item?.id ? 'Edit Certificate' : 'Add Certificate'}
          </h2>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}
            className="hover:opacity-80 transition-opacity">
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Certificate image upload */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
              Certificate Image
            </label>

            {/* Preview */}
            {preview ? (
              <div className="relative mb-3 rounded-xl overflow-hidden border"
                style={{ borderColor: 'var(--bg-border)', height: 180 }}>
                <img src={preview} alt="Preview" className="w-full h-full object-contain"
                  style={{ background: 'var(--bg)' }} />
                <button
                  type="button"
                  onClick={() => { setPreview(null); setImageFile(null); }}
                  className="absolute top-2 right-2 w-7 h-7 rounded-lg flex items-center justify-center text-white"
                  style={{ background: 'rgba(239,68,68,0.8)' }}
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div
                className="mb-3 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer"
                style={{ borderColor: 'var(--bg-border)', height: 120 }}
                onClick={() => document.getElementById('cert-img-input').click()}
              >
                <FaImage className="w-8 h-8" style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Click to upload certificate image
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
                  JPG, PNG, PDF — max 5MB
                </p>
              </div>
            )}

            <input
              id="cert-img-input"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleImage}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => document.getElementById('cert-img-input').click()}
              className="text-xs px-3 py-1.5 rounded-lg transition-all"
              style={{ border: '1px solid var(--bg-border)', color: 'var(--text-muted)', background: 'var(--bg-card)' }}
            >
              {preview ? 'Change Image' : 'Browse File'}
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Certificate Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="input" placeholder="e.g. AWS Cloud Practitioner" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Organization *</label>
            <input value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))}
              className="input" placeholder="e.g. Amazon Web Services" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Issue Date *</label>
              <input type="date" value={form.issue_date ? form.issue_date.slice(0, 10) : ''}
                onChange={e => setForm(p => ({ ...p, issue_date: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Expiry Date</label>
              <input type="date" value={form.expiry_date ? form.expiry_date.slice(0, 10) : ''}
                onChange={e => setForm(p => ({ ...p, expiry_date: e.target.value }))} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Credential URL</label>
            <input value={form.credential_url} onChange={e => setForm(p => ({ ...p, credential_url: e.target.value }))}
              className="input" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Description</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} className="input resize-none" />
          </div>

          <div className="flex gap-3 pt-2">
            <motion.button type="submit" disabled={saving}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1 justify-center" style={{ opacity: saving ? 0.7 : 1 }}>
              {saving
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
                : <><FaSave className="w-4 h-4" />Save Certificate</>
              }
            </motion.button>
            <button type="button" onClick={onClose}
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all"
              style={{ border: '1px solid var(--bg-border)', color: 'var(--text-muted)', background: 'transparent' }}>
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

/* ── Main Admin Page ───────────────────────────────────── */
const AdminCertificates = () => {
  const [certs, setCerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]   = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/certificates')
      .then(res => setCerts(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/certificates/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Certificates</h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {certs.length} certificate{certs.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setModal({})} className="btn-primary">
          <FaPlus className="w-4 h-4" /> Add Certificate
        </motion.button>
      </div>

      {/* List */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card h-32 animate-pulse" style={{ opacity: 0.4 }} />
          ))}
        </div>
      ) : certs.length === 0 ? (
        <div className="text-center py-20" style={{ color: 'var(--text-muted)' }}>
          <FaCertificate className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p>No certificates yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {certs.map((c, i) => {
            const imgUrl = c.image
              ? (c.image.startsWith('http') ? c.image : `${API_BASE}${c.image}`)
              : null;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="card overflow-hidden"
              >
                {/* Certificate image preview */}
                {imgUrl ? (
                  <div className="relative h-36 overflow-hidden"
                    style={{ background: 'var(--bg)' }}>
                    <img src={imgUrl} alt={c.name}
                      className="w-full h-full object-contain" />
                    <div className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, var(--bg-card) 0%, transparent 60%)' }} />
                  </div>
                ) : (
                  <div className="h-24 flex items-center justify-center"
                    style={{ background: 'rgba(37,99,235,0.05)', borderBottom: '1px solid var(--bg-border)' }}>
                    <FaImage className="w-8 h-8" style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
                  </div>
                )}

                {/* Info */}
                <div className="p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(37,99,235,0.12)', border: '1px solid rgba(37,99,235,0.2)' }}>
                    <FaCertificate className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm leading-snug mb-0.5 truncate"
                      style={{ color: 'var(--text)' }}>{c.name}</h3>
                    <p className="text-xs mb-1" style={{ color: 'var(--primary)' }}>{c.organization}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {c.issue_date ? new Date(c.issue_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : ''}
                    </p>
                    {c.credential_url && (
                      <a href={c.credential_url} target="_blank" rel="noopener noreferrer"
                        className="text-xs flex items-center gap-1 mt-1 hover:underline"
                        style={{ color: 'var(--accent)' }}>
                        <FaExternalLinkAlt className="w-2.5 h-2.5" /> Verify
                      </a>
                    )}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => setModal(c)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(37,99,235,0.1)', color: 'var(--primary)' }}>
                      <FaEdit className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => handleDelete(c.id, c.name)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: 'rgba(239,68,68,0.1)', color: '#F87171' }}>
                      <FaTrash className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {modal !== null && (
          <Modal
            item={modal?.id ? modal : null}
            onClose={() => setModal(null)}
            onSave={() => { setModal(null); load(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCertificates;
