import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import ScrollProgress from '../common/ScrollProgress.jsx';
import BackToTop from '../common/BackToTop.jsx';

const Layout = () => {
  return (
    <div className="min-h-screen bg-dark-bg dark:bg-dark-bg light:bg-light-bg transition-colors duration-300">
      <ScrollProgress />
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Layout;
