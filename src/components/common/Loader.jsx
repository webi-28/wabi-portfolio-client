import { motion } from 'framer-motion';

const Loader = ({ fullScreen = true }) => {
  const content = (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      >
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary border-r-secondary" />
        <div className="absolute inset-2 rounded-full border-4 border-transparent border-b-accent border-l-primary animate-spin-slow" />
      </motion.div>
      <motion.p
        className="gradient-text font-semibold text-lg"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );

  if (!fullScreen) return content;

  return (
    <div className="fixed inset-0 bg-dark-bg z-[9999] flex items-center justify-center">
      {content}
    </div>
  );
};

export default Loader;
