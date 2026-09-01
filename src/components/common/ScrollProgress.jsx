import { useScroll, useSpring, motion } from 'framer-motion';

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-0.5 z-[9999] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, var(--primary), var(--secondary), var(--accent))',
      }}
    />
  );
};

export default ScrollProgress;
