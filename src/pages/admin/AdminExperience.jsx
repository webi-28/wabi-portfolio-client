import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaBriefcase } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const TYPES = ['academic', 'volunteer', 'internship', 'part_time', 'full_time', 'freelance'];
const EMPTY = { title: '', organization: '', type: 'academic', location: '', start_date: '', end_date: '', is_current: false, description: '', responsibilities: '', technologies: '', sort_order: 0 };

const Modal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState(item
    ? { ...item, responsibilities: Array.isArray(item.responsibilities) ? item.responsibilities.join('\n') : (item.responsibilities || ''), technologies: Array.isArray(item.technologies) ? item.technologies.join(', ') : (item.technologies || '') }
    : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.organization || !form.start_date || !form.description) {
      toast.error('Title, organization, start date and description are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.split('\n').map(r => r.trim()).filter(Boolean),
        technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean),
      };
      if (item?.id) {
        await api.put(`/experience/${item.id}`, payload);
        toast.success('Experience updated');
      } else {
        await api.post('/experience', payload);
        toast.success('Experience created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card p-6 w-full max-w-xl my-8"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{item?.id ? 'Edit Experience' : 'Add Experience'}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white"><FaTimes className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="e.g. Software Developer Intern" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Organization *</label>
              <input value={form.organization} onChange={e => setForm(p => ({ ...p, organization: e.target.value }))} className="input-field" placeholder="Company / University name" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Type</label>
              <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className="input-field">
                {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Location</label>
              <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="input-field" placeholder="City, Country" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Start Date *</label>
              <input type="date" value={form.start_date ? form.start_date.slice(0, 10) : ''} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">End Date</label>
              <input type="date" value={form.end_date ? form.end_date.slice(0, 10) : ''} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} className="input-field" disabled={form.is_current} />
              <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                <input type="checkbox" checked={form.is_current} onChange={e => setForm(p => ({ ...p, is_current: e.target.checked, end_date: e.target.checked ? '' : p.end_date }))} className="accent-primary" />
                <span className="text-xs text-dark-muted">Currently working here</span>
              </label>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Brief overview of the role..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Responsibilities (one per line)</label>
              <textarea value={form.responsibilities} onChange={e => setForm(p => ({ ...p, responsibilities: e.target.value }))} rows={4} className="input-field resize-none" placeholder="Developed REST APIs&#10;Led team meetings&#10;Deployed to AWS" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Technologies (comma-separated)</label>
              <input value={form.technologies} onChange={e => setForm(p => ({ ...p, technologies: e.target.value }))} className="input-field" placeholder="React, Node.js, MySQL" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1 justify-center disabled:opacity-50">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><FaSave className="w-4 h-4" />Save</>}
            </motion.button>
            <button type="button" onClick={onClose} className="btn-ghost px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminExperience = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/experience').then(res => setItems(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try { await api.delete(`/experience/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Experience</h1>
          <p className="text-dark-muted text-sm">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModal({})} className="btn-primary">
          <FaPlus className="w-4 h-4" /> Add Experience
        </motion.button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="glass-card h-28 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-3">
          {items.map((exp, i) => (
            <motion.div key={exp.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FaBriefcase className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white text-sm">{exp.title}</h3>
                    <p className="text-secondary text-xs mt-0.5">{exp.organization}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-dark-muted text-xs">{exp.start_date ? exp.start_date.slice(0, 7) : ''} — {exp.is_current ? 'Present' : (exp.end_date ? exp.end_date.slice(0, 7) : '')}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-dark-bg/60 text-dark-muted border border-dark-border/30 capitalize">{exp.type?.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => setModal(exp)} className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"><FaEdit className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(exp.id, exp.title)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"><FaTrash className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <p className="text-dark-muted text-xs mt-2 line-clamp-2">{exp.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal !== null && (
          <Modal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminExperience;
