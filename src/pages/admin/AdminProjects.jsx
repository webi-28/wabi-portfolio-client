import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaGithub, FaExternalLinkAlt, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const EMPTY = { title: '', short_description: '', description: '', technologies: '', category: 'web', github_url: '', live_url: '', status: 'completed', is_featured: false, sort_order: 0, project_date: '' };

const Modal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState(item || EMPTY);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.short_description || !form.description) {
      toast.error('Title, short description, and description are required');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      const technologies = typeof form.technologies === 'string'
        ? form.technologies.split(',').map(t => t.trim()).filter(Boolean)
        : form.technologies;
      Object.entries({ ...form, technologies: JSON.stringify(technologies) }).forEach(([k, v]) => {
        if (v !== null && v !== undefined) fd.append(k, v);
      });
      if (imageFile) fd.append('image', imageFile);

      if (item?.id) {
        await api.put(`/projects/${item.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Project updated');
      } else {
        await api.post('/projects', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Project created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save project');
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
        className="glass-card p-6 w-full max-w-2xl my-8 relative"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{item?.id ? 'Edit Project' : 'Add New Project'}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white transition-colors"><FaTimes className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Title *</label>
              <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="Project Title" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Short Description *</label>
              <input value={form.short_description} onChange={e => setForm(p => ({ ...p, short_description: e.target.value }))} className="input-field" placeholder="Brief overview" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Full Description *</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={4} className="input-field resize-none" placeholder="Detailed description..." />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Technologies (comma-separated)</label>
              <input value={Array.isArray(form.technologies) ? form.technologies.join(', ') : form.technologies} onChange={e => setForm(p => ({ ...p, technologies: e.target.value }))} className="input-field" placeholder="React, Node.js, MySQL" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Category</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                {['web', 'mobile', 'desktop', 'api', 'database', 'other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input-field">
                {['completed', 'in_progress', 'planned'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">GitHub URL</label>
              <input value={form.github_url} onChange={e => setForm(p => ({ ...p, github_url: e.target.value }))} className="input-field" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Live URL</label>
              <input value={form.live_url} onChange={e => setForm(p => ({ ...p, live_url: e.target.value }))} className="input-field" placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Project Date</label>
              <input type="date" value={form.project_date ? form.project_date.slice(0, 10) : ''} onChange={e => setForm(p => ({ ...p, project_date: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Sort Order</label>
              <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="input-field" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Project Image</label>
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} className="input-field file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary" />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="featured" checked={form.is_featured} onChange={e => setForm(p => ({ ...p, is_featured: e.target.checked }))} className="w-4 h-4 accent-primary" />
              <label htmlFor="featured" className="text-sm text-dark-muted cursor-pointer">Featured project</label>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-primary flex-1 justify-center disabled:opacity-50">
              {saving ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</> : <><FaSave className="w-4 h-4" />Save Project</>}
            </motion.button>
            <button type="button" onClick={onClose} className="btn-ghost px-6">Cancel</button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/projects?limit=50').then(res => setProjects(res.data.data?.projects || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try { await api.delete(`/projects/${id}`); toast.success('Project deleted'); load(); }
    catch { toast.error('Failed to delete project'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
          <p className="text-dark-muted text-sm">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModal({})} className="btn-primary">
          <FaPlus className="w-4 h-4" /> Add Project
        </motion.button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="glass-card h-48 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-white text-sm leading-snug">{p.title}</h3>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => setModal(p)} className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"><FaEdit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p.id, p.title)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"><FaTrash className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <p className="text-dark-muted text-xs leading-relaxed mb-3 line-clamp-2">{p.short_description}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {(Array.isArray(p.technologies) ? p.technologies : (() => { try { return JSON.parse(p.technologies || '[]'); } catch { return []; } })()).slice(0, 3).map(t => <span key={t} className="px-1.5 py-0.5 text-xs rounded bg-dark-bg/60 text-dark-muted border border-dark-border/30">{t}</span>)}
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs rounded-full capitalize font-medium ${p.status === 'completed' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>{p.status}</span>
                {p.is_featured === 1 && <span className="px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary">Featured</span>}
                <div className="ml-auto flex gap-1.5">
                  {p.github_url && <a href={p.github_url} target="_blank" rel="noopener noreferrer" className="text-dark-muted hover:text-white transition-colors"><FaGithub className="w-3.5 h-3.5" /></a>}
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noopener noreferrer" className="text-dark-muted hover:text-accent transition-colors"><FaExternalLinkAlt className="w-3 h-3" /></a>}
                </div>
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

export default AdminProjects;
