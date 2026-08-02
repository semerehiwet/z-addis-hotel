import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]); // 👈 ለ Reviews አዲስ State
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchAllData();
      }
    });
    return () => unsubscribe();
  }, []);

  // ሁለቱንም ዳታዎች (Bookings እና Reviews) የሚያመጣ ፈንክሽን
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Bookings ዳታ ማምጫ
      const bookingsSnapshot = await getDocs(collection(db, "bookings"));
      const bookingsData = bookingsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsData);

      // Reviews ዳታ ማምጫ (በ Firebase 'reviews' የሚባል collection እንዳለህ በማሰብ)
      const reviewsSnapshot = await getDocs(collection(db, "reviews"));
      const reviewsData = reviewsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setReviews(reviewsData);
      
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      alert('❌ የተሳሳተ ኢሜይል ወይም የይለፍ ቃል! እባክዎ እንደገና ይሞክሩ።');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setEmail('');
    setPassword('');
  };

  const handleStatusChange = async (id) => {
    await updateDoc(doc(db, "bookings", id), {
      status: 'Confirmed ✅'
    });
    fetchAllData();
  };

  const handleDeleteBooking = async (id) => {
    if(window.confirm('ይህንን ማዘዣ ማጥፋት ይፈልጋሉ? (Are you sure?)')){
      await deleteDoc(doc(db, "bookings", id));
      fetchAllData();
    }
  };

  // ሪቪውን የሚያጠፋ አዲስ ፈንክሽን
  const handleDeleteReview = async (id) => {
    if(window.confirm('ይህንን አስተያየት ማጥፋት ይፈልጋሉ? (Are you sure you want to delete this review?)')){
      await deleteDoc(doc(db, "reviews", id));
      fetchAllData();
    }
  };

  if (!user) {
    return (
      <div style={{ height: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f4f4f4' }}>
        <form onSubmit={handleLogin} style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', textAlign: 'center', width: '350px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🔐</div>
          <h2 style={{ color: '#2c3e50', marginBottom: '10px' }}>Admin Dashboard</h2>
          <p style={{ color: '#e74c3c', fontSize: '0.85rem', marginBottom: '25px', fontWeight: 'bold' }}>Secure Login Required</p>
          
          <input type="email" placeholder="Admin Email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: '15px', width: '100%', marginBottom: '15px', border: '2px solid #eee', borderRadius: '8px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '15px', width: '100%', marginBottom: '20px', border: '2px solid #eee', borderRadius: '8px', boxSizing: 'border-box' }} />
          
          <button type="submit" style={{ padding: '15px', width: '100%', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem' }}>Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: '30px 15px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #e67e22', paddingBottom: '15px', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0, fontSize: '1.5rem' }}>🛡️ ZAddis Hotel Admin</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchAllData} style={{ padding: '8px 15px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
            🔄 Refresh
          </button>
          <button onClick={handleLogout} style={{ padding: '8px 15px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.9rem' }}>
            🔒 Logout
          </button>
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h3 style={{ color: '#666', fontSize: '1.1rem' }}>ዳታ በማምጣት ላይ ነው (Loading Data...) ⏳</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          
          {/* ===================== BOOKINGS SECTION ===================== */}
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.2rem', borderLeft: '4px solid #3498db', paddingLeft: '10px' }}>📅 Recent Bookings</h3>
            {bookings.length === 0 ? (
              <p style={{ fontSize: '0.95rem', color: '#777', backgroundColor: '#fff', padding: '15px', borderRadius: '8px' }}>አዲስ የተመዘገበ ማዘዣ የለም! (No bookings yet)</p>
            ) : (
              <div style={{ overflowX: 'auto', backgroundColor: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: '#fff', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px' }}>Name</th>
                      <th style={{ padding: '12px 10px' }}>Phone</th>
                      <th style={{ padding: '12px 10px' }}>Room</th>
                      <th style={{ padding: '12px 10px' }}>Dates</th>
                      <th style={{ padding: '12px 10px' }}>Status</th>
                      <th style={{ padding: '12px 10px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px' }}>{b.name}</td>
                        <td style={{ padding: '10px' }}>{b.phone}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{b.room}</td>
                        <td style={{ padding: '10px', color: '#555' }}>{b.checkIn} - {b.checkOut}</td>
                        <td style={{ padding: '10px', fontWeight: 'bold', color: b.status?.includes('✅') ? '#27ae60' : '#f39c12' }}>{b.status}</td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleStatusChange(b.id)} style={{ marginRight: '5px', padding: '6px 10px', backgroundColor: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '0.75rem' }}>Confirm</button>
                          <button onClick={() => handleDeleteBooking(b.id)} style={{ padding: '6px 10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '0.75rem' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ===================== REVIEWS SECTION ===================== */}
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px', fontSize: '1.2rem', borderLeft: '4px solid #e67e22', paddingLeft: '10px' }}>⭐ Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p style={{ fontSize: '0.95rem', color: '#777', backgroundColor: '#fff', padding: '15px', borderRadius: '8px' }}>ምንም አስተያየት የለም! (No reviews yet)</p>
            ) : (
              <div style={{ overflowX: 'auto', backgroundColor: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#2c3e50', color: '#fff', textAlign: 'left' }}>
                      <th style={{ padding: '12px 10px' }}>Reviewer Name</th>
                      <th style={{ padding: '12px 10px' }}>Rating</th>
                      <th style={{ padding: '12px 10px', width: '40%' }}>Comment</th>
                      <th style={{ padding: '12px 10px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                        <td style={{ padding: '10px', fontWeight: 'bold' }}>{r.name || r.userName || 'Anonymous'}</td>
                        <td style={{ padding: '10px', color: '#f1c40f', fontSize: '1rem' }}>{'★'.repeat(Number(r.rating) || 5)}</td>
                        <td style={{ padding: '10px', color: '#555', fontStyle: 'italic' }}>"{r.text || r.comment || r.reviewText}"</td>
                        <td style={{ padding: '10px' }}>
                          <button onClick={() => handleDeleteReview(r.id)} style={{ padding: '6px 10px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontSize: '0.75rem' }}>🗑️ Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
};

export default Admin;
