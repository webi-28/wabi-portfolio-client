import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const CATEGORIES = ['frontend', 'backend', 'programming', 'database', 'tools', 'devops', 'other'];
const EMPTY = { name: '', category: 'frontend', proficiency: 80, icon: '', color: '#2563EB', sort_order: 0 };

const Modal = ({ item, onClose, onSave }) => {
  const [form, setForm] = useState(item || EMPTY);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.category) { toast.error('Name and category are required'); return; }
    setSaving(true);
    try {
      item?.id ? await api.put(`/skills/${item.id}`, form) : await api.post('/skills', form);
      toast.success(item?.id ? 'Skill updated' : 'Skill created');
      onSave();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save skill');
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass-card p-6 w-full max-w-md relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">{item?.id ? 'Edit Skill' : 'Add Skill'}</h2>
          <button onClick={onClose} className="text-dark-muted hover:text-white"><FaTimes className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-dark-muted mb-1.5">Skill Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field" placeholder="e.g. React.js" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Category *</label>
              <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Proficiency ({form.proficiency}%)</label>
              <input type="range" min={0} max={100} value={form.proficiency} onChange={e => setForm(p => ({ ...p, proficiency: parseInt(e.target.value) }))} className="w-full accent-primary mt-2" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-dark-muted mb-1.5">Icon (react-icons key)</label>
              <input value={form.icon} onChange={e => setForm(p => ({ ...p, icon: e.target.value }))} className="input-field" placeholder="FaReact" />
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

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [filterCat, setFilterCat] = useState('all');

  const load = () => {
    setLoading(true);
    api.get('/skills?active=1').then(res => setSkills(res.data.data?.skills || [])).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete "${name}"?`)) return;
    try { await api.delete(`/skills/${id}`); toast.success('Skill deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const filtered = filterCat === 'all' ? skills : skills.filter(s => s.category === filterCat);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Skills</h1>
          <p className="text-dark-muted text-sm">{skills.length} skill{skills.length !== 1 ? 's' : ''}</p>
        </div>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModal({})} className="btn-primary">
          <FaPlus className="w-4 h-4" /> Add Skill
        </motion.button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap mb-6">
        {['all', ...CATEGORIES].map(cat => (
          <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all ${filterCat === cat ? 'bg-primary text-white' : 'bg-dark-card/60 text-dark-muted hover:text-white border border-dark-border/30'}`}>{cat}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="glass-card h-20 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((skill, i) => (
            <motion.div key={skill.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="glass-card p-4 flex items-center gap-3">
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: skill.color }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm truncate">{skill.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-dark-muted capitalize">{skill.category}</span>
                  <span className="text-xs text-primary font-medium">{skill.proficiency}%</span>
                </div>
                <div className="h-1 bg-dark-bg/60 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${skill.proficiency}%`, backgroundColor: skill.color }} />
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => setModal(skill)} className="w-7 h-7 rounded-lg bg-primary/10 hover:bg-primary/20 flex items-center justify-center text-primary transition-colors"><FaEdit className="w-3 h-3" /></button>
                <button onClick={() => handleDelete(skill.id, skill.name)} className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"><FaTrash className="w-3 h-3" /></button>
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

export default AdminSkills;
