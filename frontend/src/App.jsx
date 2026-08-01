import Chatbot from './components/Chatbot';
import Reviews from './pages/Reviews';
import React, { useState } from 'react';
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
import Restaurant from './pages/Restaurant'; // 👈 አዲሱን የሬስቶራንት ፋይል አስገባን
import Facilities from './pages/Facilities'; // 👈 አዲሱን የአገልግሎት ፋይል አስገባን
import Admin from './pages/Admin';

// አክቲቭ የሆነውን ሊንክ ለማሳወቅ የምንጠቀምበት ትንሽ ፈንክሽን
const NavLink = ({ to, currentPath, children, isDarkMode, isAccent }) => {
  const isActive = currentPath === to;
  return (
    <Link to={to} style={{
      textDecoration: 'none',
      color: isAccent ? '#e67e22' : (isDarkMode ? (isActive ? '#e67e22' : '#e0e0e0') : (isActive ? '#e67e22' : '#2c3e50')),
      fontWeight: 'bold',
      fontSize: '1.05rem',
      padding: '8px 15px',
      borderRadius: '25px',
      backgroundColor: isActive && !isDarkMode ? '#f8f9fa' : (isActive && isDarkMode ? '#333' : 'transparent'),
      transition: 'all 0.3s ease',
      borderBottom: isActive ? '2px solid #e67e22' : '2px solid transparent'
    }}>
      {children}
    </Link>
  );
};

const Navigation = ({ lang, isDarkMode }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav style={{ display: 'flex', gap: '15px', marginTop: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
      <NavLink to="/" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ዋና ገጽ' : 'Home'}</NavLink>
      <NavLink to="/about" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ስለ እኛ' : 'About Us'}</NavLink>
      <NavLink to="/rooms" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ክፍሎች' : 'Rooms & Suites'}</NavLink>
      <NavLink to="/restaurant" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ምግብ ቤት' : 'Restaurant'}</NavLink>
      <NavLink to="/facilities" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'አገልግሎቶች' : 'Facilities'}</NavLink>
      <NavLink to="/gallery" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'ጋለሪ' : 'Gallery'}</NavLink>
      <NavLink to="/contact" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'አድራሻ' : 'Contact Us'}</NavLink>
      <NavLink to="/booking" currentPath={currentPath} isDarkMode={isDarkMode} isAccent={true}>{lang === 'am' ? 'ቦኪንግ' : 'Book Now'}</NavLink>
      <NavLink to="/reviews" currentPath={currentPath} isDarkMode={isDarkMode}>{lang === 'am' ? 'አስተያየቶች' : 'Reviews'}</NavLink>
    </nav>
  );
};

function App() {
  const [lang, setLang] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(false);

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
          backgroundColor: isDarkMode ? 'rgba(18, 18, 18, 0.85)' : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.05)',
          padding: '20px 30px',
          borderBottom: isDarkMode ? '1px solid #333' : '1px solid #eaeaea'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
            </Link>
            <h1 style={{ margin: 0, fontSize: '2.5rem', fontWeight: '900', letterSpacing: '2px', display: 'flex', alignItems: 'center' }}>
                <span style={{ color: '#e67e22' }}>Z</span>
                <span style={{ color: isDarkMode ? '#fff' : '#2c3e50', fontSize: '1.8rem', marginLeft: '2px' }}>Addis</span>
              </h1>
            
            <div style={{ display: 'flex', gap: '15px' }}>
              <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ cursor: 'pointer', padding: '8px 15px', borderRadius: '25px', border: isDarkMode ? '1px solid #555' : '1px solid #ccc', backgroundColor: isDarkMode ? '#333' : '#fff', color: isDarkMode ? '#fff' : '#000', transition: 'all 0.3s' }}>
                {isDarkMode ? '☀️ Light' : '🌙 Dark'}
              </button>
              <button onClick={() => setLang(lang === 'am' ? 'en' : 'am')} style={{ cursor: 'pointer', padding: '8px 20px', borderRadius: '25px', backgroundColor: '#e67e22', color: '#fff', border: 'none', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(230, 126, 34, 0.3)' }}>
                {lang === 'am' ? 'English' : 'አማርኛ'}
              </button>
            </div>
          </div>
          
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Navigation lang={lang} isDarkMode={isDarkMode} />
          </div>
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