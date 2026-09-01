import { Helmet } from 'react-helmet-async';
import Hero from '../components/sections/Hero.jsx';
import About from '../components/sections/About.jsx';
import Skills from '../components/sections/Skills.jsx';
import Projects from '../components/sections/Projects.jsx';
import Education from '../components/sections/Education.jsx';
import Certifications from '../components/sections/Certifications.jsx';
import Experience from '../components/sections/Experience.jsx';
import Achievements from '../components/sections/Achievements.jsx';
import Languages from '../components/sections/Languages.jsx';
import Contact from '../components/sections/Contact.jsx';

const Home = () => {
  return (
    <>
      <Helmet>
        <title>Wabi Worku | IT Graduate & Full-Stack Developer</title>
        <meta name="description" content="Motivated IT graduate from Haramaya University with strong skills in software development, web technologies, and databases. Available for hire." />
        <meta property="og:title" content="Wabi Worku | IT Graduate & Full-Stack Developer" />
        <meta property="og:description" content="Motivated IT graduate passionate about building impactful digital solutions." />
        <link rel="canonical" href="https://wabiworku.dev" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Wabi Worku",
          "jobTitle": "Information Technology Graduate",
          "alumniOf": "Haramaya University",
          "url": "https://wabiworku.dev",
          "sameAs": ["https://github.com/wabiworku", "https://linkedin.com/in/wabiworku"]
        })}</script>
      </Helmet>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Education />
      <Certifications />
      <Experience />
      <Achievements />
      <Languages />
      <Contact />
    </>
  );
};

export default Home;
