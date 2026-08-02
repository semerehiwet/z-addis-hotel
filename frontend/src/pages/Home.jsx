import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ lang }) => {
  return (
    <div className="home-page" style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      
      {/* የጀርባ ምስል (Hero Section) */}
      <div style={{ 
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.65), rgba(15, 23, 42, 0.85)), url("/g1.jpg")', 
        backgroundSize: 'cover', 
        backgroundPosition: 'center', 
        color: 'white', 
        /* በስልክ እና በኮምፒውተር ራሱን የሚያስተካክል ፓዲንግ */
        padding: 'clamp(80px, 15vh, 120px) 20px', 
        textAlign: 'center',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.5)'
      }}>
        
        {/* 
          ዋናው ጽሁፍ (Heading): clamp(2rem, 6vw, 3.8rem) በስልክ 2rem፣ በኮምፒውተር 3.8rem ይሆናል። 
          እንዲሁም lineHeight: '1.2' ጽሁፎቹ እንዳይደራረቡ ይከላከላል።
        */}
        <h1 style={{ 
          fontSize: 'clamp(2rem, 6vw, 3.8rem)', 
          lineHeight: '1.2', 
          color: '#f39c12', 
          marginBottom: '20px', 
          textShadow: '2px 2px 8px rgba(0,0,0,0.8)', 
          fontWeight: 'bold' 
        }}>
          {lang === 'am' ? 'ወደ ዜድ አዲስ ሆቴል እንኳን በደህና መጡ' : 'Welcome to Z Addis Hotel'}
        </h1>
        
        <p style={{ 
          fontSize: 'clamp(1rem, 3vw, 1.3rem)', 
          maxWidth: '750px', 
          marginBottom: '40px', 
          lineHeight: '1.6', 
          textShadow: '1px 1px 5px rgba(0,0,0,0.9)', 
          color: '#e0e0e0' 
        }}>
          {lang === 'am' 
            ? 'በእውነተኛ የኢትዮጵያ መስተንግዶ እና ዘመናዊ አገልግሎት የተዋበ ቆይታን ያሳልፉ። መስተንግዷችን ከጠበቁት በላይ ነው!' 
            : 'Experience the perfect blend of authentic Ethiopian hospitality and modern luxury. Your comfort is our top priority.'}
        </p>
        
        {/* ማዘዣ እና መገኛ ቁልፎች (Buttons) */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/booking" style={{ 
            backgroundColor: '#e67e22', color: 'white', padding: '15px 35px', textDecoration: 'none', 
            fontSize: '1.1rem', borderRadius: '50px', fontWeight: 'bold', 
            boxShadow: '0 4px 15px rgba(230, 126, 34, 0.4)' 
          }}>
            {lang === 'am' ? 'አሁኑኑ ቦታ ይያዙ (Book Now)' : 'Book Your Stay Now'}
          </Link>
          <Link to="/contact" style={{ 
            backgroundColor: 'transparent', border: '2px solid #fff', color: 'white', padding: '15px 35px', 
            textDecoration: 'none', fontSize: '1.1rem', borderRadius: '50px', fontWeight: 'bold' 
          }}>
            {lang === 'am' ? 'አድራሻችን (Contact Us)' : 'Contact Us'}
          </Link>
        </div>
      </div>

      {/* የሆቴሉ ዋና ዋና አገልግሎቶች (Features Section) */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', padding: '80px 20px', backgroundColor: '#f8f9fa', color: '#333' }}>
        
        {/* አገልግሎት 1 */}
        <div style={{ textAlign: 'center', maxWidth: '320px', padding: '30px', borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', transition: 'transform 0.3s ease' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🏨</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.5rem' }}>{lang === 'am' ? 'የቅንጦት ክፍሎች' : 'Luxury Rooms'}</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>{lang === 'am' ? 'ለእርስዎ ምቾት ታስበው የተዘጋጁ እጅግ ዘመናዊ የሆኑ የተለያዩ ክፍሎች እና ስዊቶች አሉን።' : 'We offer incredibly comfortable and modern rooms and suites tailored just for you.'}</p>
        </div>

        {/* አገልግሎት 2 */}
        <div style={{ textAlign: 'center', maxWidth: '320px', padding: '30px', borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🍽️</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.5rem' }}>{lang === 'am' ? 'ልዩ የምግብ አዳራሽ' : 'Fine Dining'}</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>{lang === 'am' ? 'በተዋጣላቸው ሼፎች የሚዘጋጁ የኢትዮጵያ ባህላዊ እና አለም አቀፍ ምግቦች በተመጣጣኝ ዋጋ።' : 'Enjoy traditional Ethiopian and international cuisine prepared by expert chefs.'}</p>
        </div>
        
        {/* አገልግሎት 3 */}
        <div style={{ textAlign: 'center', maxWidth: '320px', padding: '30px', borderRadius: '15px', backgroundColor: '#fff', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '20px' }}>🌐</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.5rem' }}>{lang === 'am' ? 'ፈጣን ዋይፋይ እና አገልግሎት' : 'Free Wi-Fi & Services'}</h3>
          <p style={{ color: '#666', lineHeight: '1.6' }}>{lang === 'am' ? 'ያለገደብ የሚሰራ ፈጣን ኢንተርኔት፣ አስተማማኝ ጥበቃ እና የ 24 ሰዓት የክፍል ውስጥ አገልግሎት።' : 'High-speed unlimited internet, secure environment, and 24-hour room services.'}</p>
        </div>

      </div>
    </div>
  );
};

export default Home;
