import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaGithub, FaLinkedin, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaPhone } from 'react-icons/fa';
import { toast } from 'react-toastify';
import SectionHeader from '../common/SectionHeader.jsx';
import api from '../../services/api.js';

const CONTACT_INFO = [
  { icon: FaEnvelope,     label: 'Email',    value: 'wworku28@gmail.com',                         href: 'mailto:wworku28@gmail.com',                           color: '#3B82F6' },
  { icon: FaPhone,        label: 'Phone',    value: '0952879685',                                  href: 'tel:+251952879685',                                   color: '#10B981' },
  { icon: FaGithub,       label: 'GitHub',   value: 'github.com/webi-28',                          href: 'https://github.com/webi-28',                          color: '#E2E8F0' },
  { icon: FaLinkedin,     label: 'LinkedIn', value: 'linkedin.com/in/webi-worku',                  href: 'https://www.linkedin.com/in/webi-worku-a8737a352/',    color: '#60A5FA' },
  { icon: FaMapMarkerAlt, label: 'Location', value: 'Addis Ababa, Ethiopia',                       href: null,                                                   color: '#F87171' },
];

const INIT = { name: '', email: '', subject: '', message: '' };

const Contact = () => {
  const [form, setForm]       = useState(INIT);
  const [errors, setErrors]   = useState({});
  const [sending, setSending] = useState(false);
  const [sent, setSent]       = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim() || form.name.trim().length < 2)        e.name    = 'At least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))          e.email   = 'Valid email required';
    if (!form.subject.trim() || form.subject.trim().length < 3)  e.subject = 'At least 3 characters';
    if (!form.message.trim() || form.message.trim().length < 10) e.message = 'At least 10 characters';
    return e;
  };

  const change = e => {
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(p => ({ ...p, [e.target.name]: '' }));
  };

  const submit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSending(true);
    try {
      await api.post('/messages', form);
      setSent(true); setForm(INIT);
      toast.success('Message sent! I will get back to you soon.');
      setTimeout(() => setSent(false), 8000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send. Please try again.');
    } finally { setSending(false); }
  };

  return (
    <section id="contact" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
      <SectionHeader title="Get In Touch" subtitle="Have a project or opportunity in mind? I'd love to hear from you." />

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Left — contact info */}
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="card p-6">
            <h3 className="text-white font-bold text-base mb-5">Let's Work Together</h3>
            <div className="space-y-3">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href, color }) => (
                <motion.div key={label} whileHover={{ x: 5 }}
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-slate-800/40 group">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <div>
                    <p className="text-slate-600 text-xs mb-0.5">{label}</p>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                        className="text-white font-medium text-sm hover:text-blue-300 transition-colors">
                        {value}
                      </a>
                    ) : (
                      <p className="text-white font-medium text-sm">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Map */}
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            className="card overflow-hidden h-44 rounded-2xl">
            <iframe title="Addis Ababa" src="https://www.openstreetmap.org/export/embed.html?bbox=38.65%2C8.95%2C38.85%2C9.05&layer=mapnik"
              className="w-full h-full border-0 opacity-60" loading="lazy" />
          </motion.div>
        </div>

        {/* Right — form */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <div className="card p-6 h-full">
            {sent ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-16 text-center gap-4">
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16,185,129,0.1)', border: '2px solid rgba(16,185,129,0.3)' }}>
                  <FaCheckCircle className="w-9 h-9 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p className="text-slate-500 text-sm">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 text-xs mb-1.5 font-medium">Your Name</label>
                    <input name="name" value={form.name} onChange={change} placeholder="John Doe"
                      className={`input ${errors.name ? 'border-red-500/60' : ''}`} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-slate-500 text-xs mb-1.5 font-medium">Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={change} placeholder="you@example.com"
                      className={`input ${errors.email ? 'border-red-500/60' : ''}`} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1.5 font-medium">Subject</label>
                  <input name="subject" value={form.subject} onChange={change} placeholder="Job Opportunity / Project Collaboration / Hello"
                    className={`input ${errors.subject ? 'border-red-500/60' : ''}`} />
                  {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label className="block text-slate-500 text-xs mb-1.5 font-medium">Message</label>
                  <textarea name="message" value={form.message} onChange={change} rows={5}
                    placeholder="Tell me about your project or opportunity..."
                    className={`input resize-none ${errors.message ? 'border-red-500/60' : ''}`} />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message}</p>}
                </div>
                <motion.button type="submit" disabled={sending}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="btn-primary w-full justify-center" style={{ opacity: sending ? 0.7 : 1 }}>
                  {sending
                    ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending...</>
                    : <><FaPaperPlane className="w-3.5 h-3.5" />Send Message</>
                  }
                </motion.button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default Contact;
