import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave, FaTrophy, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const EMPTY = { title: '', description: '', icon: 'FaTrophy', color: '#F59E0B', date: '', issuer: '', sort_order: 0 };

const Modal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState(item || EMPTY);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) { toast.error('Title and description are required'); return; }
    setSaving(true);
    try {
      if (item?.id) {
        await api.put(`/achievements/${item.id}`, form);
        toast.success('Achievement updated');
      } else {
        await api.post('/achievements', form);
        toast.success('Achievement created');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{item?.id ? 'Edit Achievement' : 'Add Achievement'}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white"><FaTimes className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-dark-muted mb-1.5">Title *</label>
            <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field" placeholder="e.g. Grade A – Final Year Project" />
          </div>
          <div>
            <label className="block text-sm text-dark-muted mb-1.5">Description *</label>
            <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Brief description of this achievement..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Icon (react-icons key)</label>
              <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="input-field font-mono text-sm" placeholder="FaTrophy" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="h-10 w-14 rounded-lg cursor-pointer bg-transparent border border-dark-border/50" />
                <input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="input-field flex-1 font-mono text-sm" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Date</label>
              <input type="date" value={form.date ? form.date.slice(0, 10) : ''} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="input-field" />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Issuer</label>
              <input value={form.issuer} onChange={e => setForm(p => ({ ...p, issuer: e.target.value }))} className="input-field" placeholder="University / Organization" />
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

const AdminAchievements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/achievements').then(res => setItems(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, title) => {
    if (!confirm(`Delete "${title}"?`)) return;
    try { await api.delete(`/achievements/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Achievements</h1>
          <p className="text-dark-muted text-sm">{items.length} achievement{items.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModal({})} className="btn-primary">
          <FaPlus className="w-4 h-4" /> Add Achievement
        </motion.button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">{[1, 2, 3, 4].map(i => <div key={i} className="glass-card h-24 animate-pulse" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {items.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color + '20' }}>
                <FaTrophy className="w-5 h-5" style={{ color: a.color }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-sm">{a.title}</h3>
                <p className="text-dark-muted text-xs mt-0.5 line-clamp-2">{a.description}</p>
                {a.issuer && <p className="text-xs mt-1" style={{ color: a.color }}>{a.issuer}</p>}
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => setModal(a)} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"><FaEdit className="w-3 h-3" /></button>
                <button onClick={() => handleDelete(a.id, a.title)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"><FaTrash className="w-3 h-3" /></button>
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

export default AdminAchievements;
