import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaTrash, FaReply, FaTimes, FaCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const STATUS_STYLES = {
  unread:   'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  read:     'bg-dark-bg/60   text-dark-muted  border-dark-border/30',
  replied:  'bg-green-500/10 text-green-400   border-green-500/20',
  archived: 'bg-gray-500/10  text-gray-400    border-gray-500/20',
};

/* ── Message detail modal ─────────────────────────────────── */
const MsgModal = ({ msg, onClose, onStatusChange }) => (
  <motion.div
    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onClick={onClose}
  >
    <motion.div
      initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}
      className="glass-card p-6 w-full max-w-lg"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Message Details</h2>
        <button onClick={onClose} className="text-dark-muted hover:text-white transition-colors">
          <FaTimes className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border/30">
            <p className="text-dark-muted text-xs mb-0.5">From</p>
            <p className="text-white text-sm font-medium">{msg.name}</p>
          </div>
          <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border/30">
            <p className="text-dark-muted text-xs mb-0.5">Email</p>
            <a href={`mailto:${msg.email}`} className="text-primary text-sm hover:underline break-all">
              {msg.email}
            </a>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border/30">
          <p className="text-dark-muted text-xs mb-0.5">Subject</p>
          <p className="text-white text-sm font-medium">{msg.subject}</p>
        </div>

        <div className="p-3 rounded-xl bg-dark-bg/50 border border-dark-border/30">
          <p className="text-dark-muted text-xs mb-1">Message</p>
          <p className="text-dark-muted text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
        </div>

        <p className="text-dark-muted text-xs text-right">
          {new Date(msg.created_at).toLocaleString()}
        </p>
      </div>

      <div className="flex gap-2 flex-wrap items-center">
        {['read', 'replied', 'archived'].map(s => (
          <button
            key={s}
            onClick={() => onStatusChange(msg.id, s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border capitalize transition-all hover:opacity-80 ${STATUS_STYLES[s]}`}
          >
            Mark as {s}
          </button>
        ))}
        <a
          href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
          className="ml-auto btn-primary text-xs py-1.5 px-4"
        >
          <FaReply className="w-3 h-3" /> Reply
        </a>
      </div>
    </motion.div>
  </motion.div>
);

/* ── Main page ────────────────────────────────────────────── */
const AdminMessages = () => {
  const [messages, setMessages]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [selected, setSelected]       = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination]   = useState({ total: 0, pages: 1 });
  const [page, setPage]               = useState(1);

  const load = () => {
    setLoading(true);
    const params = {
      page,
      limit: 15,
      ...(filterStatus !== 'all' && { status: filterStatus }),
    };
    api.get('/messages', { params })
      .then(res => {
        setMessages(res.data.data?.messages || []);
        setPagination(res.data.data?.pagination || { total: 0, pages: 1 });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [page, filterStatus]);

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/messages/${id}/status`, { status });
      toast.success(`Marked as ${status}`);
      setSelected(null);
      load();
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message permanently?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Message deleted');
      load();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleOpen = (msg) => {
    setSelected(msg);
    if (msg.status === 'unread') handleStatusChange(msg.id, 'read');
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Messages</h1>
          <p className="text-dark-muted text-sm">
            {pagination.total} total message{pagination.total !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Status filters */}
      <div className="flex gap-2 flex-wrap mb-5">
        {['all', 'unread', 'read', 'replied', 'archived'].map(s => (
          <button
            key={s}
            onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all border ${
              filterStatus === s
                ? 'bg-primary text-white border-primary'
                : 'border-dark-border/30 text-dark-muted hover:text-white'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="glass-card h-16 animate-pulse" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <div className="text-center py-20 text-dark-muted">
          <FaEnvelope className="w-14 h-14 mx-auto mb-3 opacity-20" />
          <p className="text-lg">No messages yet.</p>
          <p className="text-sm mt-1 opacity-60">Contact form submissions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {messages.map((msg, i) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/30 transition-all ${
                msg.status === 'unread' ? 'border-yellow-500/30' : ''
              }`}
              onClick={() => handleOpen(msg)}
            >
              {msg.status === 'unread' && (
                <FaCircle className="w-2 h-2 text-yellow-400 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className={`text-sm font-semibold truncate ${
                    msg.status === 'unread' ? 'text-white' : 'text-dark-muted'
                  }`}>
                    {msg.name}
                  </p>
                  <span className={`px-2 py-0.5 text-xs rounded-full border capitalize flex-shrink-0 ${STATUS_STYLES[msg.status]}`}>
                    {msg.status}
                  </span>
                </div>
                <p className="text-dark-muted text-xs truncate">{msg.subject}</p>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="text-dark-muted text-xs hidden sm:block">
                  {new Date(msg.created_at).toLocaleDateString()}
                </span>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(msg.id); }}
                  className="w-7 h-7 rounded-lg bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 transition-colors"
                  aria-label="Delete message"
                >
                  <FaTrash className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${
                page === p
                  ? 'bg-primary text-white'
                  : 'border border-dark-border/30 text-dark-muted hover:text-white'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {selected && (
          <MsgModal
            msg={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminMessages;
