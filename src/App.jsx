import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import ProtectedRoute from './components/admin/ProtectedRoute.jsx';
import ScrollToTop from './components/common/ScrollToTop.jsx';
import Loader from './components/common/Loader.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home.jsx'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin.jsx'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard.jsx'));
const AdminProjects = lazy(() => import('./pages/admin/AdminProjects.jsx'));
const AdminSkills = lazy(() => import('./pages/admin/AdminSkills.jsx'));
const AdminCertificates = lazy(() => import('./pages/admin/AdminCertificates.jsx'));
const AdminExperience = lazy(() => import('./pages/admin/AdminExperience.jsx'));
const AdminAchievements = lazy(() => import('./pages/admin/AdminAchievements.jsx'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages.jsx'));
const AdminProfile = lazy(() => import('./pages/admin/AdminProfile.jsx'));
const AdminEducation = lazy(() => import('./pages/admin/AdminEducation.jsx'));
const AdminLanguages = lazy(() => import('./pages/admin/AdminLanguages.jsx'));

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <ScrollToTop />
            <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/projects" element={<AdminProjects />} />
                <Route path="/admin/skills" element={<AdminSkills />} />
                <Route path="/admin/certificates" element={<AdminCertificates />} />
                <Route path="/admin/experience" element={<AdminExperience />} />
                <Route path="/admin/achievements" element={<AdminAchievements />} />
                <Route path="/admin/messages" element={<AdminMessages />} />
                <Route path="/admin/profile" element={<AdminProfile />} />
                <Route path="/admin/education" element={<AdminEducation />} />
                <Route path="/admin/languages" element={<AdminLanguages />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>

          <ToastContainer
            position="bottom-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            toastStyle={{ background: '#1E293B', color: '#F8FAFC', border: '1px solid #334155' }}
          />
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
