import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Booking = ({ lang }) => {
  const [formData, setFormData] = useState({ 
    name: '', 
    phone: '', 
    room: 'Standard Room', 
    checkIn: '', 
    checkOut: '' 
  });
  const [loading, setLoading] = useState(false);

  // በ Rooms ገጽ ላይ ያሉት ትክክለኛ የክፍል አይነቶች፣ አልጋዎች፣ ዋጋዎች እና ፎቶዎች
  const roomDetails = {
    "Standard Room": {
      beds: lang === 'am' ? '1 ንጉስ አልጋ (Queen Size)' : '1 Queen Size Bed',
      amenities: lang === 'am' ? 'ነፃ ዋይፋይ፣ ሙቅ ውሃ፣ ቲቪ፣ የጠረጴዛ ስራ ቦታ' : 'Free WiFi, Hot Shower, TV, Work Desk',
      price: '1,500 ETB / night',
      image: '/r1.jpg'
    },
    "Twin Room": {
      beds: lang === 'am' ? '2 ነጠላ አልጋዎች (Twin Beds)' : '2 Twin Size Beds',
      amenities: lang === 'am' ? 'ነፃ ዋይፋይ፣ ಬಾልኮኒ፣ ለጓደኞች ወይም ቤተሰብ ምቹ' : 'Free WiFi, Balcony, Ideal for friends or family',
      price: '2,000 ETB / night',
      image: '/r2.jpg'
    },
    "Deluxe Room": {
      beds: lang === 'am' ? '1 ሰፊ ንጉስ አልጋ (King Size)' : '1 King Size Bed',
      amenities: lang === 'am' ? 'ሚኒ ባር፣ የከተማ እይታ (City View)፣ ጃኩዚ' : 'Mini Bar, City View, Jacuzzi, Luxury Decor',
      price: '3,000 ETB / night',
      image: '/r3.jpg'
    },
    "Presidential Suite": {
      beds: lang === 'am' ? 'ማስተር ኪንግ አልጋ + ሰፊ ሳሎን' : 'Master King Bed + Separate Living Room',
      amenities: lang === 'am' ? 'VIP አገልግሎት፣ ፕራይቬት ባልኮኒ፣ ነፃ ቁርስ (Free Breakfast)' : 'VIP Service, Private Balcony, Free Breakfast',
      price: '5,000 ETB / night',
      image: '/r4.jpg'
    }
  };

  const selectedRoom = roomDetails[formData.room];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        ...formData,
        price: selectedRoom.price,
        status: 'Pending ⏳',
        createdAt: new Date().toISOString()
      });
      alert(lang === 'am' ? 'ማዘዣዎ በተሳካ ሁኔታ ተልኳል! እናመሰግናለን።' : 'Booking successfully submitted! Thank you.');
      setFormData({ name: '', phone: '', room: 'Standard Room', checkIn: '', checkOut: '' });
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '60px 20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#e67e22', marginBottom: '30px', fontSize: '2.5rem' }}>
        {lang === 'am' ? 'አሁኑኑ ይዘዙ (Book Now)' : 'Book Your Stay'}
      </h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px', backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        
        {/* የግራ በኩል - የተመረጠው ክፍል ፎቶ እና ትክክለኛው የ Rooms መረጃ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <img 
            src={selectedRoom.image} 
            alt={formData.room} 
            style={{ width: '100%', height: '220px', objectFit: 'cover', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }} 
          />
          <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '10px', borderLeft: '4px solid #e67e22' }}>
            <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{formData.room}</h3>
            <p style={{ margin: '5px 0', color: '#555', fontSize: '0.95rem' }}>🛏️ <b>{lang === 'am' ? 'አልጋ፡' : 'Beds:'}</b> {selectedRoom.beds}</p>
            <p style={{ margin: '5px 0', color: '#555', fontSize: '0.95rem' }}>✨ <b>{lang === 'am' ? 'ምቾቶች፡' : 'Amenities:'}</b> {selectedRoom.amenities}</p>
            <p style={{ margin: '10px 0 0 0', color: '#e67e22', fontSize: '1.2rem', fontWeight: 'bold' }}>💰 {selectedRoom.price}</p>
          </div>
        </div>

        {/* የቀኝ በኩል - የማዘዣ ፎርም */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            placeholder={lang === 'am' ? 'ሙሉ ስም' : 'Full Name'} 
            required 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} 
          />
          
          <input 
            type="tel" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange} 
            placeholder={lang === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'} 
            required 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }} 
          />
          
          <select 
            name="room" 
            value={formData.room} 
            onChange={handleChange} 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #c4fb00', fontSize: '1rem', fontWeight: 'bold', backgroundColor: '#030202' }}
          >
            <option value="Standard Room">Standard Room</option>
            <option value="Twin Room">Twin Room</option>
            <option value="Deluxe Room">Deluxe Room</option>
            <option value="Presidential Suite">Presidential Suite</option>
          </select>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '0.85rem' }}>{lang === 'am' ? 'የሚገቡበት ቀን' : 'Check-In'}</label>
              <input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '5px', color: '#666', fontSize: '0.85rem' }}>{lang === 'am' ? 'የሚወጡበት ቀን' : 'Check-Out'}</label>
              <input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }} />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              marginTop: '10px',
              padding: '14px', 
              backgroundColor: loading ? '#95a5a6' : '#e67e22', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '8px', 
              fontSize: '1.1rem', 
              cursor: loading ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold', 
              transition: 'background 0.3s' 
            }}
          >
            {loading ? (lang === 'am' ? 'በመላክ ላይ...' : 'Submitting...') : (lang === 'am' ? 'አረጋግጥ (Confirm Booking)' : 'Confirm Booking')}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Booking;