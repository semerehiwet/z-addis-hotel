import Chatbot from './components/Chatbot';
import Reviews from './pages/Reviews';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import './App.css';

// ገፆችን ማምጣት (Importing pages)
import Home from './pages/Home';
import About from './pages/About';
import Rooms from './pages/Rooms';
import Booking from './pages/Booking';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Restaurant from './pages/Restaurant'; 
import Facilities from './pages/Facilities'; 
import Admin from './pages/Admin';

// አክቲቭ የሆነውን ሊንክ ለማሳወቅ የምንጠቀምበት ትንሽ ፈንክሽን
const NavLink = ({ to, currentPath, children, isDarkMode, isAccent, onClick }) => {
  const isActive = currentPath === to;
  return (
    <Link to={to} onClick={onClick} style={{
      textDecoration: 'none',
      color: isAccent ? '#e67e22' : (isDarkMode ? (isActive ? '#e67e22' : '#e0e0e0') : (isActive ? '#e67e22' : '#2c3e50')),
      fontWeight: 'bold',
      fontSize: '1.05rem',
      padding: '8px 15px',
      borderRadius: '25px',
      backgroundColor: isActive && !isDarkMode ? '#f8f9fa' : (isActive && isDarkMode ? '#333' : 'transparent'),
      transition: 'all 0.3s ease',
      borderBottom: isActive ? '2px solid #e67e22' : '2px solid transparent',
      display: 'block',
      textAlign: 'center'
    }}>
      {children}
    </Link>
  );
};

const Navigation = ({ lang, isDarkMode, isMobile, closeMenu }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav style={{ 
      display: 'flex', 
      flexDirection: isMobile ? 'column' : 'row', // በስልክ ጊዜ ወደ ታች ይደረደራል
      gap: isMobile ? '10px' : '15px', 
      marginTop: isMobile ? '15px' : '20px', 
      flexWrap: 'wrap', 
      justifyContent: 'center',
      width: '100%'
    }}>
      <NavLink onClick={closeMenu} to="/" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ዋና ገጽ' : 'Home'}</NavLink>
      <NavLink onClick={closeMenu} to="/about" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ስለ እኛ' : 'About Us'}</NavLink>
      <NavLink onClick={closeMenu} to="/rooms" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ክፍሎች' : 'Rooms & Suites'}</NavLink>
      <NavLink onClick={closeMenu} to="/restaurant" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ምግብ ቤት' : 'Restaurant'}</NavLink>
      <NavLink onClick={closeMenu} to="/facilities" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'አገልግሎቶች' : 'Facilities'}</NavLink>
      <NavLink onClick={closeMenu} to="/gallery" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ጋለሪ' : 'Gallery'}</NavLink>
      <NavLink onClick={closeMenu} to="/contact" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'አድራሻ' : 'Contact Us'}</NavLink>
      <NavLink onClick={closeMenu} to="/booking" currentPath={currentPath} isDarkMode={isDarkMode} isAccent={true}>{lang === 'am' ? 'ቦኪንግ' : 'Book Now'}</NavLink>
      <NavLink onClick={closeMenu} to="/reviews" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'አስተያየቶች' : 'Reviews'}</NavLink>
    </nav>
  );
};

function App() {
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // ስክሪኑ የሞባይል መሆኑን ማወቂያ እና ሜኑ መክፈቻ/መዝጊያ
  const [isMobile, setIsMobile] = useState(window.innerWidth < 850);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 850);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Router>
      <div style={{ 
        backgroundColor: isDarkMode ? '#121212' : '#fafafa', 
        color: isDarkMode ? '#f5f5f5' : '#333', 
        minHeight: '100vh', 
        display: 'flex', 
        flexDirection: 'column',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
      }}>
        <Helmet>
          <title>ZAddis Luxury Hotel - Addis Ababa</title>
        </Helmet>

        <header style={{
          position: 'sticky', top: 0, zIndex: 1000,
          backgroundColor: isDarkMode ? 'rgba(18, 18, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.05)',
          padding: isMobile ? '15px 20px' : '20px 30px',
          borderBottom: isDarkMode ? '1px solid #333' : '1px solid #eaeaea'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            
            <Link to="/" style={{ textDecoration: 'none' }}>
              <h1 style={{ margin: 0, fontSize: isMobile ? '1.8rem' : '2.5rem', fontWeight: '900', letterSpacing: '1px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#e67e22' }}>Z</span>
                <span style={{ color: isDarkMode ? '#fff' : '#2c3e50', fontSize: isMobile ? '1.4rem' : '1.8rem', marginLeft: '2px' }}>Addis</span>
              </h1>
            </Link>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ cursor: 'pointer', padding: isMobile ? '6px 10px' : '8px 15px', borderRadius: '25px', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', fontSize: isMobile ? '0.85rem' : '1rem' }}>
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button onClick={() => setLang(lang === 'am' ? 'en' : 'am')} style={{ cursor: 'pointer', padding: isMobile ? '6px 12px' : '8px 20px', borderRadius: '25px', backgroundColor: '#e67e22', color: '#fff', border: 'none', fontWeight: 'bold', fontSize: isMobile ? '0.85rem' : '1rem' }}>
                {lang === 'am' ? 'EN' : 'አማ'}
              </button>
              
              {/* በስልክ ጊዜ የሚታይ የሜኑ መክፈቻ ቁልፍ (Hamburger Icon) */}
              {isMobile && (
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)} 
                  style={{ background: 'none', border: 'none', fontSize: '1.8rem', color: isDarkMode ? '#fff' : '#333', cursor: 'pointer', marginLeft: '5px' }}
                >
                  {isMenuOpen ? '✕' : '☰'}
                </button>
              )}
            </div>
          </div>
          
          {/* ሜኑው በኮምፒውተር ሁሌም ይታያል፣ በስልክ ግን ቁልፉ ሲነካ ብቻ */}
          {(!isMobile || isMenuOpen) && (
            <div style={{ maxWidth: '1200px', margin: '0 auto', transition: 'all 0.3s ease' }}>
              <Navigation lang={lang} isDarkMode={isDarkMode} isMobile={isMobile} closeMenu={() => setIsMenuOpen(false)} />
            </div>
          )}
        </header>

        {/* ዋናው የገፆች ማሳያ */}
        <main style={{ flex: '1', width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home lang={lang} />} />
            <Route path="/about" element={<About lang={lang} />} />
            <Route path="/rooms" element={<Rooms lang={lang} />} />
            <Route path="/booking" element={<Booking lang={lang} />} />
            <Route path="/restaurant" element={<Restaurant lang={lang} />} />
            <Route path="/facilities" element={<Facilities lang={lang} />} />
            <Route path="/gallery" element={<Gallery lang={lang} />} />
            <Route path="/contact" element={<Contact lang={lang} />} />
            <Route path="/admin-secure" element={<Admin />} />
            <Route path="/reviews" element={<Reviews lang={lang} />} />
          </Routes>
        </main>

        {/* ያማረ ፉተር (Footer) */}
        <footer style={{ backgroundColor: '#1a252f', color: '#ecf0f1', padding: '40px 20px', textAlign: 'center', marginTop: 'auto', borderTop: '4px solid #e67e22' }}>
          <h2 style={{ color: '#e67e22', marginBottom: '15px' }}>ZAddis Hotel</h2>
          <p style={{ marginBottom: '20px', color: '#bdc3c7' }}>Luxury Meets Comfort in Addis Ababa.</p>
          <p style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>© {new Date().getFullYear()} ZAddis Luxury Hotel. All Rights Reserved.</p>
        </footer>

        {/* WhatsApp Chat */}
        <a href="https://wa.me/251927537572" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: '30px', right: '30px', backgroundColor: '#25D366', color: 'white', width: '60px', height: '60px', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '50%', textDecoration: 'none', fontSize: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)', zIndex: 1000, transition: 'transform 0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}>
          💬
        </a>
        <Chatbot lang={lang} />
      </div>
    </Router>
  );
}
export default App;
