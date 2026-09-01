import { motion } from 'framer-motion';

const SectionWrapper = ({ id, className = '', children }) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`py-20 px-4 md:px-8 max-w-7xl mx-auto ${className}`}
    >
      {children}
    </motion.section>
  );
};

export default SectionWrapper;
