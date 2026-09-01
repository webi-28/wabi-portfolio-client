import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle }) => {
  const words = title.split(' ');
  const last  = words.pop();
  const rest  = words.join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-14 text-center"
    >
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
        {rest && <span>{rest} </span>}
        <span className="gradient-text">{last}</span>
      </h2>

      {/* Centered accent line */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-0.5 w-10 rounded-full"
          style={{ background: 'linear-gradient(90deg, transparent, #2563EB)' }} />
        <div className="w-2 h-2 rounded-full bg-blue-500" />
        <div className="h-0.5 w-20 rounded-full"
          style={{ background: 'linear-gradient(90deg, #2563EB, #22D3EE, transparent)' }} />
      </div>

      {subtitle && (
        <p className="text-slate-500 text-base leading-relaxed max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
