import React from 'react';

const Facilities = ({ lang }) => (
  <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', color: '#e67e22', marginBottom: '40px', fontSize: '2.5rem' }}>
      🌟 {lang === 'am' ? 'የሆቴላችን አገልግሎቶች' : 'Premium Facilities'}
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
      
      {[
        { icon: '🚗', titleAm: 'የመኪና ማቆሚያ', titleEn: 'Parking Space', descAm: 'ደህንነቱ የተጠበቀ ሰፊ ነጻ የመኪና ማቆሚያ።', descEn: 'Secure and spacious free parking area.' },
        { icon: '💪', titleAm: 'ጂም እና ስፓ', titleEn: 'Gym & Spa', descAm: 'የተሟላ የስፖርት ማዘውተሪያ እና ማሳጅ።', descEn: 'Fully equipped fitness center and relaxing spa.' },
        { icon: '🎤', titleAm: 'የስብሰባ አዳራሽ', titleEn: 'Conference Halls', descAm: 'ለሰርግ እና ለስብሰባ የሚሆኑ ሰፊ አዳራሾች።', descEn: 'Spacious halls for weddings and corporate events.' },
        { icon: '🌐', titleAm: 'ነፃ ዋይፋይ', titleEn: 'High-Speed Wi-Fi', descAm: 'ፈጣን የኢንተርኔት አገልግሎት በየክፍሉ።', descEn: 'Complimentary high-speed internet across the hotel.' },
        { icon: '🛡️', titleAm: 'የ24 ሰዓት ጥበቃ', titleEn: '24/7 Security', descAm: 'በካሜራ እና በጥበቃ የተደገፈ አስተማማኝ ደህንነት።', descEn: 'Round-the-clock security with CCTV monitoring.' },
        { icon: '🚐', titleAm: 'ነፃ ትራንስፖርት', titleEn: 'Shuttle Service', descAm: 'ከኤርፖርት ወደ ሆቴል ነፃ የትራንስፖርት አገልግሎት።', descEn: 'Complimentary airport pickup and drop-off.' }
      ].map((fac, index) => (
        <div key={index} style={{ padding: '25px', backgroundColor: '#f9f9f9', borderRadius: '10px', textAlign: 'center', borderBottom: '3px solid #e67e22' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>{fac.icon}</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>{lang === 'am' ? fac.titleAm : fac.titleEn}</h3>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>{lang === 'am' ? fac.descAm : fac.descEn}</p>
        </div>
      ))}
    </div>
  </div>
);

export default Facilities;