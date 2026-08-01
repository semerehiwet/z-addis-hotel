import React from 'react';

const Restaurant = ({ lang }) => (
  <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', color: '#e67e22', marginBottom: '10px', fontSize: '2.5rem' }}>
      🍽️ {lang === 'am' ? 'ምግብ ቤት እና ባር' : 'Restaurant & Bar'}
    </h2>
    <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#666', marginBottom: '40px' }}>
      {lang === 'am' ? 'በአለም አቀፍ ደረጃ እውቅና ባላቸው ሼፎች የሚዘጋጁ ጣፋጭ ምግቦች።' : 'Experience world-class dining with our expert chefs.'}
    </p>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h3 style={{ color: '#2c3e50', fontSize: '1.5rem', marginBottom: '15px' }}>🍲 {lang === 'am' ? 'የሀገር ባህል ምግቦች' : 'Traditional Cuisine'}</h3>
        <p style={{ color: '#555', lineHeight: '1.6' }}>{lang === 'am' ? 'ከክትፎ እስከ አግዓዚ ፆም እና ፍስክ ምግቦችን በንጽህና እናቀርባለን።' : 'Authentic Ethiopian dishes prepared with the finest local spices.'}</p>
      </div>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h3 style={{ color: '#2c3e50', fontSize: '1.5rem', marginBottom: '15px' }}>🍝 {lang === 'am' ? 'የውጪ ምግቦች' : 'International Menu'}</h3>
        <p style={{ color: '#555', lineHeight: '1.6' }}>{lang === 'am' ? 'ጣሊያን፣ ቻይናዊ እና አሜሪካን ምግቦችን ምርጫዎ አድርገው ማዘዝ ይችላሉ።' : 'A wide variety of Italian, Asian, and Continental dishes.'}</p>
      </div>
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)', textAlign: 'center' }}>
        <h3 style={{ color: '#2c3e50', fontSize: '1.5rem', marginBottom: '15px' }}>🍷 {lang === 'am' ? 'ቪ አይ ፒ ባር' : 'VIP Lounge & Bar'}</h3>
        <p style={{ color: '#555', lineHeight: '1.6' }}>{lang === 'am' ? 'ዘመናዊ መጠጦች፣ ኮክቴሎች እና የተለያዩ የወይን አይነቶች በሙዚቃ ታጅበው።' : 'Premium cocktails, wines, and spirits in a relaxing atmosphere.'}</p>
      </div>
    </div>
  </div>
);

export default Restaurant;