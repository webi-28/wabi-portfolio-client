import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const LEVELS = ['Native', 'Fluent', 'Conversational', 'Basic'];
const EMPTY = { name: '', level: 'Fluent', proficiency: 80, flag: '🌍', color: '#2563EB', sort_order: 0 };

const Modal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState(item || EMPTY);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Name is required'); return; }
    setSaving(true);
    try {
      if (item?.id) {
        await api.put(`/languages/${item.id}`, form);
        toast.success('Language updated');
      } else {
        await api.post('/languages', form);
        toast.success('Language added');
      }
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="glass-card p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{item?.id ? 'Edit Language' : 'Add Language'}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white"><FaTimes className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-dark-muted mb-1.5">Language Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. English" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Level</label>
              <select value={form.level} onChange={e => setForm(p => ({ ...p, level: e.target.value }))} className="input-field">
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Proficiency ({form.proficiency}%)</label>
              <input type="range" min={0} max={100} value={form.proficiency} onChange={e => setForm(p => ({ ...p, proficiency: parseInt(e.target.value) }))} className="w-full accent-primary mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Flag Emoji</label>
              <input value={form.flag} onChange={e => setForm(p => ({ ...p, flag: e.target.value }))} className="input-field text-2xl" placeholder="🌍" maxLength={4} />
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Color</label>
              <div className="flex gap-2">
                <input type="color" value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="h-10 w-14 rounded-lg cursor-pointer bg-transparent border border-dark-border/50" />
                <input value={form.color} onChange={e => setForm(p => ({ ...p, color: e.target.value }))} className="input-field flex-1 font-mono text-sm" />
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm text-dark-muted mb-1.5">Sort Order</label>
            <input type="number" value={form.sort_order} onChange={e => setForm(p => ({ ...p, sort_order: parseInt(e.target.value) || 0 }))} className="input-field" />
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

const AdminLanguages = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  const load = () => {
    setLoading(true);
    api.get('/languages').then(res => setItems(res.data.data || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/languages/${id}`); toast.success('Deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Languages</h1>
          <p className="text-dark-muted text-sm">{items.length} language{items.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModal({})} className="btn-primary">
          <FaPlus className="w-4 h-4" /> Add Language
        </motion.button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-3 gap-4">{[1, 2, 3].map(i => <div key={i} className="glass-card h-36 animate-pulse" />)}</div>
      ) : (
        <div className="grid sm:grid-cols-3 gap-4">
          {items.map((lang, i) => (
            <motion.div key={lang.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="glass-card p-5 text-center relative">
              <div className="absolute top-3 right-3 flex gap-1">
                <button onClick={() => setModal(lang)} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"><FaEdit className="w-3 h-3" /></button>
                <button onClick={() => handleDelete(lang.id, lang.name)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"><FaTrash className="w-3 h-3" /></button>
              </div>
              <div className="text-4xl mb-2">{lang.flag}</div>
              <h3 className="font-bold text-white mb-0.5">{lang.name}</h3>
              <p className="text-sm font-semibold mb-1" style={{ color: lang.color }}>{lang.level}</p>
              <div className="h-1.5 bg-dark-bg/60 rounded-full overflow-hidden mt-2">
                <div className="h-full rounded-full" style={{ width: `${lang.proficiency}%`, backgroundColor: lang.color }} />
              </div>
              <p className="text-xs mt-1 font-bold" style={{ color: lang.color }}>{lang.proficiency}%</p>
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

export default AdminLanguages;
