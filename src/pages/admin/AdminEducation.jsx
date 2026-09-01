import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaGraduationCap } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const EMPTY = { institution: '', degree: '', field_of_study: '', gpa: '', max_gpa: '4.00', start_date: '', end_date: '', is_current: false, location: '', description: '', achievements: '', sort_order: 0 };

const Modal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState(item
    ? { ...item, achievements: Array.isArray(item.achievements) ? item.achievements.join('\n') : '' }
    : EMPTY
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.institution || !form.degree || !form.start_date) {
      toast.error('Institution, degree and start date are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        achievements: form.achievements.split('\n').map(a => a.trim()).filter(Boolean),
        gpa: form.gpa ? parseFloat(form.gpa) : null,
        max_gpa: parseFloat(form.max_gpa) || 4.00,
      };
      if (item?.id) {
        await api.put(`/education/${item.id}`, payload);
        toast.success('Education updated');
      } else {
        await api.post('/education', payload);
        toast.success('Education created');
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
          <h2 className="text-xl font-bold text-white">{item?.id ? 'Edit Education' : 'Add Education'}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white"><FaTimes className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Institution *</label>
              <input value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))} className="input-field" placeholder="Haramaya University" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Degree *</label>
              <input value={form.degree} onChange={e => setForm(p => ({ ...p, degree: e.target.value }))} className="input-field" placeholder="Bachelor of Science" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Field of Study</label>
              <input value={form.field_of_study} onChange={e => setForm(p => ({ ...p, field_of_study: e.target.value }))} className="input-field" placeholder="Information Technology" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">GPA</label>
              <input type="number" step="0.01" value={form.gpa} onChange={e => setForm(p => ({ ...p, gpa: e.target.value }))} className="input-field" placeholder="3.55" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Max GPA</label>
              <input type="number" step="0.01" value={form.max_gpa} onChange={e => setForm(p => ({ ...p, max_gpa: e.target.value }))} className="input-field" placeholder="4.00" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Start Date *</label>
              <input type="date" value={form.start_date ? form.start_date.slice(0, 10) : ''} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">End Date</label>
              <input type="date" value={form.end_date ? form.end_date.slice(0, 10) : ''} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} className="input-field" disabled={form.is_current} />
              <label className="flex items-center gap-2 mt-1.5 cursor-pointer">
                <input type="checkbox" checked={form.is_current} onChange={e => setForm(p => ({ ...p, is_current: e.target.checked }))} className="accent-primary" />
                <span className="text-xs text-dark-muted">Currently studying here</span>
              </label>
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Location</label>
              <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} className="input-field" placeholder="Haramaya, Ethiopia" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field resize-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm text-dark-muted mb-1.5">Achievements (one per line)</label>
              <textarea value={form.achievements} onChange={e => setForm(p => ({ ...p, achievements: e.target.value }))} rows={3} className="input-field resize-none" placeholder={"Dean's List\nGrade A in Final Project\n..."} />
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

const AdminEducation = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/education').then(res => setItems(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/education/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Education</h1>
          <p className="text-dark-muted text-sm">{items.length} education entry</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModal({})} className="btn-primary">
          <FaPlus className="w-4 h-4" /> Add Education
        </motion.button>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2].map(i => <div key={i} className="glass-card h-28 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
          {items.map((edu, i) => (
            <motion.div key={edu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-5 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center flex-shrink-0">
                <FaGraduationCap className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white">{edu.degree} in {edu.field_of_study}</h3>
                <p className="text-primary font-semibold text-sm mt-0.5">{edu.institution}</p>
                <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-dark-muted">
                  <span>{edu.start_date?.slice(0, 7)} — {edu.is_current ? 'Present' : edu.end_date?.slice(0, 7)}</span>
                  {edu.gpa && <span className="text-yellow-400 font-semibold">GPA: {edu.gpa}/{edu.max_gpa}</span>}
                  {edu.location && <span>{edu.location}</span>}
                </div>
                {edu.description && <p className="text-dark-muted text-xs mt-2 line-clamp-2">{edu.description}</p>}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => setModal(edu)} className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"><FaEdit className="w-3.5 h-3.5" /></button>
                <button onClick={() => handleDelete(edu.id, edu.institution)} className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"><FaTrash className="w-3.5 h-3.5" /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modal !== null && <Modal item={modal?.id ? modal : null} onClose={() => setModal(null)} onSave={() => { setModal(null); load(); }} />}
      </AnimatePresence>
    </div>
  );
};

export default AdminEducation;
