import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center px-4">
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center"
    >
      <motion.div
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-9xl font-black gradient-text mb-4"
      >
        404
      </motion.div>
      <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-dark-muted mb-8 max-w-md mx-auto">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4 justify-center">
        <Link to="/" className="btn-primary">
          <FaHome className="w-4 h-4" /> Go Home
        </Link>
        <button onClick={() => history.back()} className="btn-secondary">
          <FaArrowLeft className="w-4 h-4" /> Go Back
        </button>
      </div>
    </motion.div>
  </div>
);

export default NotFound;
