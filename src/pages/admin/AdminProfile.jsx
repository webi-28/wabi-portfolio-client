import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaSave, FaUser, FaImage, FaLink, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from '../../services/api.js';

const Section = ({ title, icon: Icon, children }) => (
  <div className="glass-card p-6 mb-5">
    <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
      <Icon className="text-primary w-4 h-4" /> {title}
    </h2>
    {children}
  </div>
);

const Field = ({ label, children }) => (
  <div>
    <label className="block text-sm text-dark-muted mb-1.5">{label}</label>
    {children}
  </div>
);

const AdminProfile = () => {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    api.get('/settings').then(res => {
      setSettings(res.data.data || {});
    }).catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const set = (key, value) => setSettings(p => ({ ...p, [key]: value }));

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Upload photo if changed
      if (imageFile) {
        const fd = new FormData();
        fd.append('image', imageFile);
        const res = await api.post('/settings/profile-image', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        set('profile_image', res.data.data.path);
      }
      // Upload CV if changed
      if (cvFile) {
        const fd = new FormData();
        fd.append('cv', cvFile);
        await api.post('/settings/cv', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('CV uploaded successfully!');
      }
      // Save all settings
      await api.put('/settings', settings);
      toast.success('Profile saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  );

  const profileSrc = preview || (settings.profile_image
    ? (settings.profile_image.startsWith('/uploads')
      ? `${import.meta.env.VITE_API_URL?.replace('/api', '')}${settings.profile_image}`
      : settings.profile_image)
    : null);

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Profile & Hero</h1>
          <p className="text-dark-muted text-sm">Edit your name, bio, photo, and social links</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={handleSave} disabled={saving}
          className="btn-primary disabled:opacity-50"
        >
          {saving
            ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
            : <><FaSave className="w-4 h-4" />Save All Changes</>
          }
        </motion.button>
      </div>

      {/* Profile Photo */}
      <Section title="Profile Photo" icon={FaImage}>
        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-primary/30 flex-shrink-0 bg-dark-bg/50">
            {profileSrc
              ? <img src={profileSrc} alt="Profile" className="w-full h-full object-cover object-top" />
              : <div className="w-full h-full flex items-center justify-center text-4xl font-black gradient-text">WW</div>
            }
          </div>
          <div className="flex-1">
            <label className="block text-sm text-dark-muted mb-2">Upload new photo</label>
            <input
              type="file" accept="image/*" onChange={handleImageChange}
              className="input-field file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-sm"
            />
            <p className="text-dark-muted text-xs mt-1.5">Recommended: 400×400px, square crop (JPG/PNG)</p>
          </div>
        </div>
      </Section>

      {/* CV Upload */}
      <Section title="CV / Resume Upload" icon={FaLink}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1">
            <label className="block text-sm text-dark-muted mb-2">Upload your CV (PDF only, max 10MB)</label>
            <input
              type="file" accept="application/pdf"
              onChange={e => setCvFile(e.target.files[0])}
              className="input-field file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary file:text-sm"
            />
            {cvFile && (
              <p className="text-green-400 text-xs mt-1.5 flex items-center gap-1">
                ✅ Ready to upload: {cvFile.name}
              </p>
            )}
          </div>
          <a
            href={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/api/settings/cv/download`}
            target="_blank" rel="noopener noreferrer"
            className="btn-secondary text-sm py-2 px-4 flex-shrink-0"
          >
            Preview Current CV
          </a>
        </div>
        <p className="text-dark-muted text-xs mt-2">
          After uploading, visitors who click "Download CV" on the portfolio will get this file.
        </p>
      </Section>

      {/* Hero Section */}
      <Section title="Hero Section" icon={FaUser}>
        <div className="space-y-4">
          <Field label="Full Name">
            <input value={settings.hero_name || ''} onChange={e => set('hero_name', e.target.value)} className="input-field" placeholder="Wabi Worku" />
          </Field>
          <Field label="Typing Animation Roles (comma-separated)">
            <input value={settings.hero_roles || ''} onChange={e => set('hero_roles', e.target.value)} className="input-field" placeholder="Full-Stack Developer, React Developer, ..." />
            <p className="text-dark-muted text-xs mt-1">Each role will be shown one at a time in the typing animation</p>
          </Field>
          <Field label="Hero Bio Paragraph">
            <textarea value={settings.hero_bio || ''} onChange={e => set('hero_bio', e.target.value)} rows={3} className="input-field resize-none" placeholder="Brief intro shown below your name..." />
          </Field>
        </div>
      </Section>

      {/* Personal Info */}
      <Section title="Personal Information" icon={FaInfoCircle}>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name">
            <input value={settings.owner_name || ''} onChange={e => set('owner_name', e.target.value)} className="input-field" />
          </Field>
          <Field label="Email">
            <input value={settings.owner_email || ''} onChange={e => set('owner_email', e.target.value)} className="input-field" />
          </Field>
          <Field label="Phone">
            <input value={settings.owner_phone || ''} onChange={e => set('owner_phone', e.target.value)} className="input-field" />
          </Field>
          <Field label="Location">
            <input value={settings.owner_location || ''} onChange={e => set('owner_location', e.target.value)} className="input-field" />
          </Field>
          <Field label="University">
            <input value={settings.owner_university || ''} onChange={e => set('owner_university', e.target.value)} className="input-field" />
          </Field>
          <Field label="Degree">
            <input value={settings.owner_degree || ''} onChange={e => set('owner_degree', e.target.value)} className="input-field" />
          </Field>
          <Field label="Graduation Date">
            <input value={settings.owner_graduation || ''} onChange={e => set('owner_graduation', e.target.value)} className="input-field" placeholder="June 2026" />
          </Field>
          <Field label="CGPA">
            <input value={settings.owner_cgpa || ''} onChange={e => set('owner_cgpa', e.target.value)} className="input-field" placeholder="3.55/4.00" />
          </Field>
          <Field label="Spoken Languages">
            <input value={settings.owner_languages || ''} onChange={e => set('owner_languages', e.target.value)} className="input-field" placeholder="Afaan Oromo, Amharic, English" />
          </Field>
          <Field label="Available for Work">
            <select value={settings.available_for_work || 'true'} onChange={e => set('available_for_work', e.target.value)} className="input-field">
              <option value="true">Yes — Show "Available for Work" badge</option>
              <option value="false">No — Hide badge</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* About Section */}
      <Section title="About Me Section" icon={FaInfoCircle}>
        <div className="space-y-4">
          <Field label="Professional Summary">
            <textarea value={settings.about_summary || ''} onChange={e => set('about_summary', e.target.value)} rows={4} className="input-field resize-none" />
          </Field>
          <Field label="Career Objective">
            <textarea value={settings.about_objective || ''} onChange={e => set('about_objective', e.target.value)} rows={4} className="input-field resize-none" />
          </Field>
        </div>
      </Section>

      {/* Social Links */}
      <Section title="Social & Links" icon={FaLink}>
        <div className="space-y-4">
          <Field label="GitHub URL">
            <input value={settings.github_url || ''} onChange={e => set('github_url', e.target.value)} className="input-field font-mono text-sm" placeholder="https://github.com/username" />
          </Field>
          <Field label="LinkedIn URL">
            <input value={settings.linkedin_url || ''} onChange={e => set('linkedin_url', e.target.value)} className="input-field font-mono text-sm" placeholder="https://linkedin.com/in/username" />
          </Field>
          <Field label="CV / Resume Download URL">
            <input value={settings.cv_url || ''} onChange={e => set('cv_url', e.target.value)} className="input-field font-mono text-sm" placeholder="/downloads/my-cv.pdf" />
          </Field>
          <Field label="Site Title (browser tab)">
            <input value={settings.site_title || ''} onChange={e => set('site_title', e.target.value)} className="input-field" />
          </Field>
        </div>
      </Section>

      {/* Save button bottom */}
      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={handleSave} disabled={saving}
        className="btn-primary w-full justify-center disabled:opacity-50 mt-2"
      >
        {saving
          ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>
          : <><FaSave className="w-4 h-4" />Save All Changes</>
        }
      </motion.button>
    </div>
  );
};

export default AdminProfile;
