import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

const Reviews = ({ lang }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ name: '', rating: '5', comment: '' });
  const [loading, setLoading] = useState(false);

  // አስተያየቶችን ከፋየርቤዝ ማምጣት
  const fetchReviews = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(data);
    } catch (error) {
      console.error("Error loading reviews: ", error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleChange = (e) => setNewReview({ ...newReview, [e.target.name]: e.target.value });

  // አዲስ አስተያየት ወደ ፋየርቤዝ መላክ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'reviews'), {
        ...newReview,
        date: new Date().toLocaleDateString()
      });
      alert(lang === 'am' ? 'አስተያየትዎ በተሳካ ሁኔታ ተልኳል! እናመሰግናለን።' : 'Review submitted successfully! Thank you.');
      setNewReview({ name: '', rating: '5', comment: '' });
      fetchReviews(); // አዲሱን አስተያየት ወዲያውኑ ለማሳየት
    } catch (error) {
      alert('Error: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', color: '#e67e22', marginBottom: '30px', fontSize: '2.2rem' }}>
        {lang === 'am' ? 'የደንበኞች አስተያየት' : 'Guest Reviews'}
      </h2>

      {/* አስተያየት መጻፊያ ፎርም (በስልክ ሲከፈት ራሱን የሚያስተካክል) */}
      <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)', marginBottom: '40px' }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          {lang === 'am' ? 'አስተያየትዎን ያካፍሉን' : 'Share Your Experience'}
        </h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <input 
              type="text" name="name" value={newReview.name} onChange={handleChange} required 
              placeholder={lang === 'am' ? 'ሙሉ ስም' : 'Full Name'} 
              style={{ flex: '1 1 250px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} 
            />
            <select 
              name="rating" value={newReview.rating} onChange={handleChange} 
              style={{ flex: '1 1 150px', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}
            >
              <option value="5">⭐⭐⭐⭐⭐ (5/5)</option>
              <option value="4">⭐⭐⭐⭐ (4/5)</option>
              <option value="3">⭐⭐⭐ (3/5)</option>
              <option value="2">⭐⭐ (2/5)</option>
              <option value="1">⭐ (1/5)</option>
            </select>
          </div>
          <textarea 
            name="comment" value={newReview.comment} onChange={handleChange} required 
            placeholder={lang === 'am' ? 'ስለ ሆቴላችን ያለዎትን አስተያየት እዚህ ይጻፉ...' : 'Write your feedback here...'} 
            rows="4" 
            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }} 
          />
          <button 
            type="submit" disabled={loading} 
            style={{ padding: '12px 20px', backgroundColor: '#e67e22', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', alignSelf: 'flex-start' }}
          >
            {loading ? (lang === 'am' ? 'በመላክ ላይ...' : 'Submitting...') : (lang === 'am' ? 'አስተያየት ላክ' : 'Submit Review')}
          </button>
        </form>
      </div>
      {/* የተላኩ አስተያየቶች ማሳያ (Grid System - Mobile Responsive) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {reviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#777', gridColumn: '1 / -1' }}>
            {lang === 'am' ? 'እስካሁን ምንም አስተያየት አልተሰጠም። የመጀመሪያው ይሁኑ!' : 'No reviews yet. Be the first to leave one!'}
          </p>
        ) : (
          reviews.map((rev) => (
            <div key={rev.id} style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '12px', borderLeft: '4px solid #3498db' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <strong style={{ color: '#2c3e50' }}>👤 {rev.name}</strong>
                <span>{'⭐'.repeat(Number(rev.rating))}</span>
              </div>
              <p style={{ color: '#555', fontSize: '0.95rem', lineHeight: '1.5', fontStyle: 'italic' }}>"{rev.comment}"</p>
              <small style={{ color: '#999', display: 'block', marginTop: '10px' }}>📅 {rev.date}</small>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default Reviews;