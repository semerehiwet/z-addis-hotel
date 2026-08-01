import React from 'react';

const Gallery = ({ lang }) => {
  // አጭር ስም ያላቸው የጋለሪ ፎቶዎች
  const photos = [
    { id: 1, src: '/g1.jpg', title: lang === 'am' ? 'የሆቴሉ ገጽታ 1' : 'Hotel View 1' },
    { id: 2, src: '/g2.jpg', title: lang === 'am' ? 'የሆቴሉ ገጽታ 2' : 'Hotel View 2' },
    { id: 3, src: '/g3.jpg', title: lang === 'am' ? 'የሆቴሉ ገጽታ 3' : 'Hotel View 3' },
    { id: 4, src: '/g4.jpg', title: lang === 'am' ? 'የሆቴሉ ገጽታ 4' : 'Hotel View 4' },
    { id: 5, src: '/g5.jpg', title: lang === 'am' ? 'የሆቴሉ ገጽታ 5' : 'Hotel View 5' },
    { id: 6, src: '/g6.jpg', title: lang === 'am' ? 'የሆቴሉ ገጽታ 6' : 'Hotel View 6' },
    { id: 7, src: '/g7.jpg', title: lang === 'am' ? 'የሆቴሉ ገጽታ 7' : 'Hotel View 7' },
  ];

  return (
    <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
      <h2 style={{ color: '#e67e22', marginBottom: '20px', fontSize: '2.5rem' }}>
        {lang === 'am' ? 'የሆቴላችን ምስሎች (Gallery)' : 'Our Hotel Gallery'}
      </h2>
      <p style={{ marginBottom: '40px', fontSize: '1.2rem', color: '#555' }}>
        {lang === 'am' 
          ? 'የዜድ አዲስ ሆቴልን ውበት እና ምቾት በምስል ይመልከቱ።' 
          : 'Take a look at the beauty and comfort of ZAddis Hotel.'}
      </p>

      {/* ፎቶዎቹ የሚደረደሩበት ቆንጆ ግሪድ (Grid) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '25px' }}>
        {photos.map((photo) => (
          <div key={photo.id} style={{ overflow: 'hidden', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.15)', backgroundColor: '#fff', transition: 'transform 0.3s ease' }}>
            <img 
              src={photo.src} 
              alt={photo.title} 
              style={{ width: '100%', height: '250px', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Photo+g1.jpg+Missing';
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;