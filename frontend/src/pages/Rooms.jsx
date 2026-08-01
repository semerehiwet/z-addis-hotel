import React from 'react';
import { Link } from 'react-router-dom';

export const roomData = [
  { id: 'standard', nameAm: 'መደበኛ ክፍል (Standard)', nameEn: 'Standard Room', price: '1,500', img: '/r1.jpg', bed: '1 Queen Bed', size: '25 sq m' },
  { id: 'twin', nameAm: 'መንታ አልጋ (Twin Room)', nameEn: 'Twin Room', price: '2,000', img: '/r2.jpg', bed: '2 Single Beds', size: '30 sq m' },
  { id: 'deluxe', nameAm: 'ቪ አይ ፒ (Deluxe)', nameEn: 'Deluxe Room', price: '3,000', img: '/r3.jpg', bed: '1 King Bed', size: '40 sq m' },
  { id: 'suite', nameAm: 'ፕሬዝዳንታዊ (Suite)', nameEn: 'Presidential Suite', price: '5,000', img: '/r4.jpg', bed: '1 King Bed + Sofa', size: '60 sq m' }
];

const Rooms = ({ lang }) => (
  <div style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
    <h2 style={{ textAlign: 'center', color: '#e67e22', marginBottom: '40px', fontSize: '2.5rem' }}>
      {lang === 'am' ? 'የሆቴላችን ክፍሎች' : 'Our Rooms & Suites'}
    </h2>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
      {roomData.map((room) => (
        <div key={room.id} style={{ backgroundColor: '#fff', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
          <img src={room.img} alt={room.nameEn} style={{ width: '100%', height: '200px', objectFit: 'cover' }} onError={(e) => e.target.src = 'https://via.placeholder.com/400x200?text=Room+Photo'} />
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>{lang === 'am' ? room.nameAm : room.nameEn}</h3>
            <p style={{ color: '#777', fontSize: '0.9rem', marginBottom: '15px' }}>🛏️ {room.bed} | 📐 {room.size}</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e67e22', marginBottom: '15px' }}>{room.price} ETB <span style={{fontSize:'1rem', color:'#555'}}>/ Night</span></p>
            <Link to={`/booking?room=${room.id}`} style={{ display: 'inline-block', padding: '10px 25px', backgroundColor: '#2c3e50', color: '#fff', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' }}>
              {lang === 'am' ? 'አሁን ቦታ ያዙ' : 'Book Now'}
            </Link>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default Rooms;