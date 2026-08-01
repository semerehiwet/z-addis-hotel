import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchBookings();
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
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
    fetchBookings();
  };

  const handleDelete = async (id) => {
    if(window.confirm('ይህንን ማዘዣ ማጥፋት ይፈልጋሉ? (Are you sure?)')){
      await deleteDoc(doc(db, "bookings", id));
      fetchBookings();
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
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #e67e22', paddingBottom: '15px', marginBottom: '30px' }}>
        <h2 style={{ color: '#2c3e50', margin: 0 }}>🛡️ ZAddis Hotel Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={fetchBookings} style={{ padding: '10px 20px', backgroundColor: '#3498db', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>

          </button>
          🔄 Refresh
          
          <button onClick={handleLogout} style={{ padding: '10px 20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            🔒 Logout
          </button>
        </div>
      </div>
      
      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h3 style={{ color: '#666' }}>ዳታ በማምጣት ላይ ነው (Loading Data...) ⏳</h3>
        </div>
      ) : bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: '#fff', borderRadius: '10px' }}>
          <p style={{ fontSize: '1.2rem', color: '#777' }}>አዲስ የተመዘገበ ማዘዣ የለም! (No bookings yet)</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', boxShadow: '0 5px 15px rgba(0,0,0,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#2c3e50', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '20px 15px' }}>Client Name</th>
                <th style={{ padding: '20px 15px' }}>Phone</th>
                <th style={{ padding: '20px 15px' }}>Room Type</th>
                <th style={{ padding: '20px 15px' }}>Dates</th>
                <th style={{ padding: '20px 15px' }}>Status</th>
                <th style={{ padding: '20px 15px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background 0.3s' }}>
                  <td style={{ padding: '15px' }}>{b.name}</td>
                  <td style={{ padding: '15px' }}>{b.phone}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold' }}>{b.room}</td>
                  <td style={{ padding: '15px', fontSize: '0.9rem' }}>{b.checkIn} to {b.checkOut}</td>
                  <td style={{ padding: '15px', fontWeight: 'bold', color: b.status?.includes('✅') ? '#27ae60' : '#f39c12' }}>{b.status}</td>
                  <td style={{ padding: '15px' }}>
                    <button onClick={() => handleStatusChange(b.id)} style={{ marginRight: '10px', padding: '8px 12px', backgroundColor: '#27ae60', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Confirm</button>
                    <button onClick={() => handleDelete(b.id)} style={{ padding: '8px 12px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Admin;