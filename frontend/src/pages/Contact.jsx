import React from 'react';

const Contact = ({ lang }) => {
  return (
    <div style={{ padding: '50px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#e67e22', marginBottom: '40px' }}>
        {lang === 'am' ? 'አድራሻችንን ያግኙ (Contact Us)' : 'Get In Touch'}
      </h2>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
        {/* የዕውቂያ ቅጽ */}
        <div style={{ flex: '1', minWidth: '300px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <input type="text" placeholder={lang === 'am' ? 'ሙሉ ስም' : 'Full Name'} required style={{ padding: '15px', border: '1px solid #f5f4f4', borderRadius: '5px' }} />
            <input type="number" placeholder={lang === 'am' ? 'ኢሜል' : 'phone number'} required style={{ padding: '15px', border: '1px solid #f8f4f4', borderRadius: '5px' }} />
            <textarea placeholder={lang === 'am' ? 'መልዕክትዎን እዚህ ይጻፉ...' : 'Your Message...'} rows="5" required style={{ padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}></textarea>
            <button type="submit" style={{ padding: '15px', backgroundColor: '#000102', color: '#e6cf00', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
              {lang === 'am' ? 'መልዕክት ላክ' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* የድርጅት አድራሻ እና የካርታ ሊንክ */}
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ marginBottom: '20px', fontSize: '1.1rem', backgroundColor: '#c9c504', padding: '20px', borderRadius: '8px' }}>
            <h3 style={{ color: '#2c3e50', marginTop: '0' }}>Z Addis Hotel</h3>
            <p><strong>📌 {lang === 'am' ? 'አድራሻ:' : 'Location:'}</strong> Addis Ababa, Ethiopia</p>
            <p><strong>☎️ {lang === 'am' ? 'ስልክ (WhatsApp):' : 'Phone (WhatsApp):'}</strong> +251 906 90 90 91</p>
            
            <a 
              href="https://maps.app.goo.gl/1JJCxy9X3AYUYEeDA" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#4285F4', color: 'white', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}
            >
              🗺️ {lang === 'am' ? 'በ Google Maps ይክፈቱ' : 'Open in Google Maps'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;