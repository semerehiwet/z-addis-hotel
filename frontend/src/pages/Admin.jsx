import React, { useEffect, useMemo, useState } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
  query
} from 'firebase/firestore';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const Admin = () => {
  // =========================
  // AUTH
  // =========================
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // =========================
  // DATA
  // =========================
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // =========================
  // SEARCH / FILTER
  // =========================
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilter, setBookingFilter] = useState('all');

  // =========================
  // AUTH LISTENER
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        fetchAllData();
      }
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // FETCH DATA
  // =========================
  const fetchAllData = async () => {
    setLoading(true);

    try {
      const bookingsQuery = query(
        collection(db, 'bookings'),
        orderBy('createdAt', 'desc')
      );

      const bookingsSnapshot = await getDocs(bookingsQuery);

      const bookingsData = bookingsSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      setBookings(bookingsData);

      const reviewsSnapshot = await getDocs(
        collection(db, 'reviews')
      );

      const reviewsData = reviewsSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      setReviews(reviewsData);
    } catch (error) {
      console.error('Fetch error:', error);

      // fallback if createdAt/orderBy causes an index or missing-field issue
      try {
        const bookingsSnapshot = await getDocs(
          collection(db, 'bookings')
        );

        const bookingsData = bookingsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        bookingsData.sort((a, b) => {
          const dateA = new Date(a.createdAt || 0).getTime();
          const dateB = new Date(b.createdAt || 0).getTime();

          return dateB - dateA;
        });

        setBookings(bookingsData);

        const reviewsSnapshot = await getDocs(
          collection(db, 'reviews')
        );

        const reviewsData = reviewsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        setReviews(reviewsData);
      } catch (secondError) {
        console.error('Fallback fetch error:', secondError);

        alert(
          'Unable to load data. Please check your Firebase connection and Firestore rules.'
        );
      }
    }

    setLoading(false);
  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
    } catch (error) {
      console.error(error);

      alert(
        '❌ Incorrect email or password.'
      );
    }

    setLoginLoading(false);
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // CONFIRM BOOKING
  // =========================
  const handleConfirmBooking = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'Confirmed',
        confirmedAt: new Date().toISOString()
      });

      await fetchAllData();
    } catch (error) {
      console.error(error);
      alert('Unable to confirm booking.');
    }
  };

  // =========================
  // CANCEL BOOKING
  // =========================
  const handleCancelBooking = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'Cancelled',
        cancelledAt: new Date().toISOString()
      });

      await fetchAllData();
    } catch (error) {
      console.error(error);
      alert('Unable to cancel booking.');
    }
  };

  // =========================
  // DELETE BOOKING
  // =========================
  const handleDeleteBooking = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this booking?'
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'bookings', id));
      await fetchAllData();
    } catch (error) {
      console.error(error);
      alert('Unable to delete booking.');
    }
  };

  // =========================
  // DELETE REVIEW
  // =========================
  const handleDeleteReview = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review?'
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'reviews', id));
      await fetchAllData();
    } catch (error) {
      console.error(error);
      alert('Unable to delete review.');
    }
  };

  // =========================
  // STATISTICS
  // =========================
  const stats = useMemo(() => {
    const total = bookings.length;

    const confirmed = bookings.filter(
      (b) =>
        String(b.status || '').toLowerCase() === 'confirmed' ||
        String(b.status || '').includes('✅')
    ).length;

    const pending = bookings.filter(
      (b) =>
        String(b.status || '').toLowerCase().includes('pending') ||
        String(b.status || '').includes('⏳')
    ).length;

    const cancelled = bookings.filter(
      (b) =>
        String(b.status || '').toLowerCase().includes('cancelled')
    ).length;

    const revenue = bookings
      .filter(
        (b) =>
          String(b.status || '').toLowerCase() === 'confirmed' ||
          String(b.status || '').includes('✅')
      )
      .reduce((sum, booking) => {
        const value = Number(
          booking.totalPrice ||
          booking.totalAmount ||
          booking.amount ||
          0
        );

        return sum + (Number.isFinite(value) ? value : 0);
      }, 0);

    return {
      total,
      confirmed,
      pending,
      cancelled,
      revenue
    };
  }, [bookings]);

  // =========================
  // FILTER BOOKINGS
  // =========================
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const search = bookingSearch.toLowerCase();

      const matchesSearch =
        !search ||
        String(booking.name || '')
          .toLowerCase()
          .includes(search) ||
        String(booking.phone || '')
          .toLowerCase()
          .includes(search) ||
        String(booking.room || '')
          .toLowerCase()
          .includes(search);

      const status = String(
        booking.status || ''
      ).toLowerCase();

      let matchesFilter = true;

      if (bookingFilter === 'pending') {
        matchesFilter =
          status.includes('pending') ||
          status.includes('⏳');
      }

      if (bookingFilter === 'confirmed') {
        matchesFilter =
          status.includes('confirmed') ||
          status.includes('✅');
      }

      if (bookingFilter === 'cancelled') {
        matchesFilter = status.includes('cancelled');
      }

      return matchesSearch && matchesFilter;
    });
  }, [bookings, bookingSearch, bookingFilter]);

  // =========================
  // HELPERS
  // =========================
  const getStatusStyle = (status) => {
    const value = String(status || '').toLowerCase();

    if (value.includes('confirmed') || value.includes('✅')) {
      return {
        background: '#dcfce7',
        color: '#15803d'
      };
    }

    if (value.includes('cancelled')) {
      return {
        background: '#fee2e2',
        color: '#dc2626'
      };
    }

    return {
      background: '#fef3c7',
      color: '#b45309'
    };
  };

  const formatMoney = (value) => {
    const number = Number(value);

    if (!Number.isFinite(number) || number === 0) {
      return '-';
    }

    return `${number.toLocaleString()} ETB`;
  };

  const formatDate = (date) => {
    if (!date) return '-';

    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return date;
    }
  };

  // =========================
  // LOADING AUTH
  // =========================
  if (authLoading) {
    return (
      <div style={styles.fullScreenLoader}>
        <div style={styles.loaderIcon}>🏨</div>
        <h3>Loading Z Addis Hotel...</h3>
      </div>
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================
  if (!user) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginBackground}></div>

        <form
          onSubmit={handleLogin}
          style={styles.loginCard}
        >
          <div style={styles.loginLogo}>
            🏨
          </div>

          <h1 style={styles.loginTitle}>
            Z Addis Hotel
          </h1>

          <p style={styles.loginSubtitle}>
            Admin Dashboard
          </p>

          <div style={styles.secureBadge}>
            🔐 Secure Administrator Login
          </div>

          <label style={styles.label}>
            Email Address
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            style={styles.input}
          />

          <label style={styles.label}>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            style={styles.input}
          />

          <button
            type="submit"
            disabled={loginLoading}
            style={{
              ...styles.loginButton,
              opacity: loginLoading ? 0.7 : 1
            }}
          >
            {loginLoading
              ? 'Signing in...'
              : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================
  return (
    <div style={styles.page}>

      {/* HEADER */}
      <header style={styles.header}>
        <div>
          <div style={styles.brand}>
            Z ADDIS
          </div>

          <div style={styles.brandSub}>
            HOTEL ADMINISTRATION
          </div>
        </div>

        <div style={styles.headerRight}>
          <div style={styles.adminInfo}>
            <div style={styles.adminAvatar}>
              👤
            </div>

            <div>
              <strong>Administrator</strong>
              <small>{user.email}</small>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            🚪 Logout
          </button>
        </div>
      </header>

      {/* NAVIGATION */}
      <nav style={styles.nav}>
        <button
          onClick={() => setActiveTab('dashboard')}
          style={{
            ...styles.navButton,
            ...(activeTab === 'dashboard'
              ? styles.navButtonActive
              : {})
          }}
        >
          📊 Dashboard
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            ...styles.navButton,
            ...(activeTab === 'bookings'
              ? styles.navButtonActive
              : {})
          }}
        >
          📅 Bookings
          <span style={styles.navCount}>
            {bookings.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('reviews')}
          style={{
            ...styles.navButton,
            ...(activeTab === 'reviews'
              ? styles.navButtonActive
              : {})
          }}
        >
          ⭐ Reviews
          <span style={styles.navCount}>
            {reviews.length}
          </span>
        </button>

        <button
          onClick={fetchAllData}
          style={styles.refreshButton}
        >
          🔄 Refresh
        </button>
      </nav>

      {/* CONTENT */}
      <main style={styles.content}>

        {/* ================= DASHBOARD ================= */}
        {activeTab === 'dashboard' && (
          <>
            <div style={styles.pageHeading}>
              <div>
                <h1>Dashboard Overview</h1>
                <p>
                  Manage your hotel bookings and customer reviews.
                </p>
              </div>

              <div style={styles.liveBadge}>
                ● LIVE
              </div>
            </div>

            {/* STAT CARDS */}
            <div style={styles.statsGrid}>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>📅</div>

                <div>
                  <span>Total Bookings</span>
                  <strong>{stats.total}</strong>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>✅</div>

                <div>
                  <span>Confirmed</span>
                  <strong>{stats.confirmed}</strong>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>⏳</div>

                <div>
                  <span>Pending</span>
                  <strong>{stats.pending}</strong>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>⭐</div>

                <div>
                  <span>Reviews</span>
                  <strong>{reviews.length}</strong>
                </div>
              </div>

              <div style={styles.statCard}>
                <div style={styles.statIcon}>💰</div>

                <div>
                  <span>Confirmed Revenue</span>
                  <strong style={{ fontSize: '1.2rem' }}>
                    {formatMoney(stats.revenue)}
                  </strong>
                </div>
              </div>

            </div>

            {/* RECENT BOOKINGS */}
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2>Recent Bookings</h2>
                  <p>Latest hotel reservations</p>
                </div>

                <button
                  onClick={() => setActiveTab('bookings')}
                  style={styles.viewButton}
                >
                  View All →
                </button>
              </div>

              {loading ? (
                <LoadingBox />
              ) : bookings.length === 0 ? (
                <EmptyBox text="No bookings yet." />
              ) : (
                <BookingTable
                  bookings={bookings.slice(0, 5)}
                  onConfirm={handleConfirmBooking}
                  onCancel={handleCancelBooking}
                  onDelete={handleDeleteBooking}
                  getStatusStyle={getStatusStyle}
                  formatMoney={formatMoney}
                  formatDate={formatDate}
                  compact
                />
              )}
            </section>

            {/* RECENT REVIEWS */}
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <div>
                  <h2>Customer Reviews</h2>
                  <p>What your guests are saying</p>
                </div>

                <button
                  onClick={() => setActiveTab('reviews')}
                  style={styles.viewButton}
                >
                  View All →
                </button>
              </div>

              {reviews.length === 0 ? (
                <EmptyBox text="No reviews yet." />
              ) : (
                <div style={styles.reviewGrid}>
                  {reviews.slice(0, 4).map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onDelete={handleDeleteReview}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {/* ================= BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <>
            <div style={styles.pageHeading}>
              <div>
                <h1>Hotel Bookings</h1>
                <p>
                  View, confirm, cancel and manage reservations.
                </p>
              </div>
            </div>

            {/* SEARCH */}
            <div style={styles.toolbar}>
              <div style={styles.searchBox}>
                🔎
                <input
                  type="text"
                  placeholder="Search by name, phone or room..."
                  value={bookingSearch}
                  onChange={(e) =>
                    setBookingSearch(e.target.value)
                  }
                />
              </div>

              <select
                value={bookingFilter}
                onChange={(e) =>
                  setBookingFilter(e.target.value)
                }
                style={styles.filterSelect}
              >
                <option value="all">
                  All Bookings
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </div>

            {loading ? (
              <LoadingBox />
            ) : filteredBookings.length === 0 ? (
              <EmptyBox text="No bookings found." />
            ) : (
              <section style={styles.tableCard}>
                <BookingTable
                  bookings={filteredBookings}
                  onConfirm={handleConfirmBooking}
                  onCancel={handleCancelBooking}
                  onDelete={handleDeleteBooking}
                  getStatusStyle={getStatusStyle}
                  formatMoney={formatMoney}
                  formatDate={formatDate}
                />
              </section>
            )}
          </>
        )}

        {/* ================= REVIEWS ================= */}
        {activeTab === 'reviews' && (
          <>
            <div style={styles.pageHeading}>
              <div>
                <h1>Customer Reviews</h1>
                <p>
                  Manage feedback from your hotel guests.
                </p>
              </div>
            </div>

            {reviews.length === 0 ? (
              <EmptyBox text="No customer reviews yet." />
            ) : (
              <div style={styles.reviewGridLarge}>
                {reviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onDelete={handleDeleteReview}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </main>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <span>
          © {new Date().getFullYear()} Z Addis Hotel
        </span>

        <span>
          Admin Dashboard
        </span>
      </footer>
    </div>
  );
};


// =====================================================
// BOOKING TABLE COMPONENT
// =====================================================

const BookingTable = ({
  bookings,
  onConfirm,
  onCancel,
  onDelete,
  getStatusStyle,
  formatMoney,
  formatDate,
  compact = false
}) => {
  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>

        <thead>
          <tr>
            <th>Guest</th>
            <th>Room</th>
            {!compact && <th>Guests</th>}
            <th>Stay</th>
            <th>Status</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {bookings.map((booking) => {

            const statusStyle = getStatusStyle(
              booking.status
            );

            const adults =
              Number(booking.adults) || 0;

            const children =
              Number(booking.children) || 0;

            const rooms =
              Number(booking.rooms) || 1;

            return (
              <tr key={booking.id}>

                {/* GUEST */}
                <td>
                  <div style={styles.guestCell}>
                    <div style={styles.guestAvatar}>
                      {String(
                        booking.name || 'G'
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {booking.name || 'Guest'}
                      </strong>

                      <small>
                        {booking.phone || '-'}
                      </small>
                    </div>
                  </div>
                </td>

                {/* ROOM */}
                <td>
                  <strong>
                    {booking.room || '-'}
                  </strong>

                  <small style={styles.tableSmall}>
                    {rooms} room
                    {rooms > 1 ? 's' : ''}
                  </small>
                </td>

                {/* GUEST COUNT */}
                {!compact && (
                  <td>
                    <div style={styles.guestNumbers}>
                      <span>
                        👨 {adults} Adults
                      </span>

                      <span>
                        👶 {children} Children
                      </span>
                    </div>
                  </td>
                )}

                {/* DATES */}
                <td>
                  <div style={styles.dateCell}>
                    <strong>
                      {formatDate(booking.checkIn)}
                    </strong>

                    <span>→</span>

                    <strong>
                      {formatDate(booking.checkOut)}
                    </strong>
                  </div>

                  {booking.nights && (
                    <small style={styles.tableSmall}>
                      {booking.nights} night
                      {Number(booking.nights) > 1
                        ? 's'
                        : ''}
                    </small>
                  )}
                </td>

                {/* STATUS */}
                <td>
                  <span
                    style={{
                      ...styles.statusBadge,
                      background:
                        statusStyle.background,
                      color:
                        statusStyle.color
                    }}
                  >
                    {booking.status ||
                      'Pending'}
                  </span>
                </td>

                {/* PRICE */}
                <td>
                  <strong>
                    {formatMoney(
                      booking.totalPrice
                    )}
                  </strong>
                </td>

                {/* ACTIONS */}
                <td>
                  <div style={styles.actions}>

                    {!String(
                      booking.status || ''
                    )
                      .toLowerCase()
                      .includes('confirmed') && (
                      <button
                        title="Confirm booking"
                        onClick={() =>
                          onConfirm(booking.id)
                        }
                        style={
                          styles.confirmButton
                        }
                      >
                        ✓
                      </button>
                    )}

                    {!String(
                      booking.status || ''
                    )
                      .toLowerCase()
                      .includes('cancelled') && (
                      <button
                        title="Cancel booking"
                        onClick={() =>
                          onCancel(booking.id)
                        }
                        style={
                          styles.cancelButton
                        }
                      >
                        ×
                      </button>
                    )}

                    <button
                      title="Delete booking"
                      onClick={() =>
                        onDelete(booking.id)
                      }
                      style={
                        styles.deleteButton
                      }
                    >
                      🗑
                    </button>

                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
};


// =====================================================
// REVIEW CARD
// =====================================================

const ReviewCard = ({ review, onDelete }) => {
  const rating = Math.min(
    5,
    Math.max(
      0,
      Number(review.rating) || 5
    )
  );

  const reviewer =
    review.name ||
    review.userName ||
    'Anonymous';

  const comment =
    review.text ||
    review.comment ||
    review.reviewText ||
    'No comment';

  return (
    <div style={styles.reviewCard}>

      <div style={styles.reviewTop}>
        <div style={styles.reviewer}>
          <div style={styles.reviewerAvatar}>
            {String(reviewer)
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>
            <strong>{reviewer}</strong>

            <div style={styles.stars}>
              {'★'.repeat(rating)}
              {'☆'.repeat(5 - rating)}
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(review.id)}
          style={styles.reviewDelete}
          title="Delete review"
        >
          🗑
        </button>
      </div>

      <p style={styles.reviewText}>
        “{comment}”
      </p>

      {review.createdAt && (
        <small style={styles.reviewDate}>
          {new Date(
            review.createdAt
          ).toLocaleDateString()}
        </small>
      )}

    </div>
  );
};


// =====================================================
// LOADING BOX
// =====================================================

const LoadingBox = () => (
  <div style={styles.emptyBox}>
    <div style={styles.loadingSpinner}>⏳</div>
    <h3>Loading data...</h3>
    <p>Please wait a moment.</p>
  </div>
);


// =====================================================
// EMPTY BOX
// =====================================================

const EmptyBox = ({ text }) => (
  <div style={styles.emptyBox}>
    <div style={styles.emptyIcon}>📭</div>
    <h3>{text}</h3>
    <p>There is nothing to display here yet.</p>
  </div>
);


// =====================================================
// STYLES
// =====================================================

const styles = {

  // PAGE
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #f8fafc 0%, #eef2f7 100%)',
    color: '#1e293b',
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },

  // LOGIN
  loginPage: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    background:
      'linear-gradient(135deg, #0f172a, #1e293b)'
  },

  loginBackground: {
    position: 'fixed',
    inset: 0,
    background:
      'radial-gradient(circle at top right, rgba(230,126,34,0.25), transparent 35%)',
    pointerEvents: 'none'
  },

  loginCard: {
    position: 'relative',
    width: '100%',
    maxWidth: '430px',
    background: 'rgba(255,255,255,0.98)',
    padding: '45px',
    borderRadius: '24px',
    boxShadow:
      '0 30px 80px rgba(0,0,0,0.35)',
    boxSizing: 'border-box'
  },

  loginLogo: {
    width: '75px',
    height: '75px',
    margin: '0 auto 20px',
    borderRadius: '22px',
    background:
      'linear-gradient(135deg, #e67e22, #f39c12)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2.2rem'
  },

  loginTitle: {
    textAlign: 'center',
    margin: 0,
    color: '#0f172a',
    fontSize: '2rem'
  },

  loginSubtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: '8px',
    marginBottom: '20px'
  },

  secureBadge: {
    textAlign: 'center',
    background: '#fff7ed',
    color: '#c2410c',
    padding: '10px',
    borderRadius: '10px',
    fontSize: '0.85rem',
    fontWeight: '600',
    marginBottom: '25px'
  },

  label: {
    display: 'block',
    marginBottom: '7px',
    color: '#334155',
    fontWeight: '600',
    fontSize: '0.9rem'
  },

  input: {
    width: '100%',
    padding: '14px 15px',
    marginBottom: '18px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outline: 'none'
  },

  loginButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '11px',
    background:
      'linear-gradient(135deg, #e67e22, #f39c12)',
    color: '#fff',
    fontWeight: '700',
    fontSize: '1rem',
    cursor: 'pointer'
  },

  // HEADER
  header: {
    background:
      'linear-gradient(135deg, #0f172a, #1e293b)',
    color: '#fff',
    padding: '20px 5%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap',
    boxShadow:
      '0 5px 25px rgba(15,23,42,0.18)'
  },

  brand: {
    fontSize: '1.5rem',
    fontWeight: '900',
    letterSpacing: '3px',
    color: '#f39c12'
  },

  brandSub: {
    fontSize: '0.65rem',
    letterSpacing: '2px',
    color: '#cbd5e1',
    marginTop: '3px'
  },

  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    flexWrap: 'wrap'
  },

  adminInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  adminAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: '#334155',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

  logoutButton: {
    padding: '10px 15px',
    border: '1px solid #475569',
    background: 'transparent',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  // NAV
  nav: {
    background: '#fff',
    padding: '10px 5%',
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
    flexWrap: 'wrap',
    borderBottom: '1px solid #e2e8f0'
  },

  navButton: {
    border: 'none',
    background: 'transparent',
    padding: '10px 15px',
    borderRadius: '8px',
    cursor: 'pointer',
    color: '#64748b',
    fontWeight: '600'
  },

  navButtonActive: {
    background: '#fff7ed',
    color: '#ea580c'
  },

  navCount: {
    marginLeft: '7px',
    background: '#e2e8f0',
    color: '#475569',
    borderRadius: '20px',
    padding: '2px 7px',
    fontSize: '0.7rem'
  },

  refreshButton: {
    marginLeft: 'auto',
    padding: '10px 15px',
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  // CONTENT
  content: {
    width: '90%',
    maxWidth: '1500px',
    margin: '0 auto',
    padding: '35px 0 60px'
  },

  pageHeading: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    gap: '20px'
  },

  liveBadge: {
    background: '#dcfce7',
    color: '#15803d',
    padding: '8px 14px',
    borderRadius: '30px',
    fontSize: '0.75rem',
    fontWeight: '800'
  },

  // STATS
  statsGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '18px',
    marginBottom: '35px'
  },

  statCard: {
    background: '#fff',
    borderRadius: '18px',
    padding: '22px',
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    boxShadow:
      '0 8px 30px rgba(15,23,42,0.06)',
    border: '1px solid #eef2f7'
  },

  statIcon: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    background: '#fff7ed',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '1.5rem'
  },

  // SECTION
  section: {
    background: '#fff',
    borderRadius: '20px',
    padding: '25px',
    marginBottom: '30px',
    boxShadow:
      '0 8px 30px rgba(15,23,42,0.06)',
    overflow: 'hidden'
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '15px'
  },

  viewButton: {
    border: 'none',
    background: '#fff7ed',
    color: '#ea580c',
    padding: '9px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700'
  },

  // TOOLBAR
  toolbar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },

  searchBox: {
    flex: 1,
    minWidth: '250px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '0 15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  filterSelect: {
    padding: '12px 15px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    background: '#fff',
    minWidth: '160px'
  },

  // TABLE
  tableCard: {
    background: '#fff',
    borderRadius: '20px',
    boxShadow:
      '0 8px 30px rgba(15,23,42,0.06)',
    overflow: 'hidden'
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto'
  },

  table: {
    width: '100%',
    minWidth: '950px',
    borderCollapse: 'collapse'
  },

  guestCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  guestAvatar: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    background:
      'linear-gradient(135deg, #e67e22, #f39c12)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800'
  },

  tableSmall: {
    display: 'block',
    color: '#94a3b8',
    fontSize: '0.75rem',
    marginTop: '3px'
  },

  guestNumbers: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    fontSize: '0.8rem'
  },

  dateCell: {
    display: 'flex',
    gap: '7px',
    alignItems: 'center',
    whiteSpace: 'nowrap'
  },

  statusBadge: {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: '30px',
    fontSize: '0.75rem',
    fontWeight: '800',
    whiteSpace: 'nowrap'
  },

  actions: {
    display: 'flex',
    gap: '5px'
  },

  confirmButton: {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '7px',
    background: '#16a34a',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
  },

  cancelButton: {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '7px',
    background: '#f59e0b',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold'
  },

  deleteButton: {
    width: '32px',
    height: '32px',
    border: 'none',
    borderRadius: '7px',
    background: '#ef4444',
    color: '#fff',
    cursor: 'pointer'
  },

  // REVIEWS
  reviewGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '15px'
  },

  reviewGridLarge: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px'
  },

  reviewCard: {
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '20px',
    boxShadow:
      '0 5px 20px rgba(15,23,42,0.04)'
  },

  reviewTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '10px'
  },

  reviewer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },

  reviewerAvatar: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    background: '#fff7ed',
    color: '#ea580c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800'
  },

  stars: {
    color: '#f59e0b',
    fontSize: '0.9rem',
    marginTop: '3px'
  },

  reviewText: {
    color: '#475569',
    lineHeight: '1.7',
    fontSize: '0.9rem',
    margin: '20px 0 10px'
  },

  reviewDate: {
    color: '#94a3b8'
  },

  reviewDelete: {
    border: 'none',
    background: '#fee2e2',
    color: '#dc2626',
    width: '32px',
    height: '32px',
    borderRadius: '7px',
    cursor: 'pointer'
  },

  // EMPTY
  emptyBox: {
    background: '#fff',
    borderRadius: '18px',
    padding: '60px 20px',
    textAlign: 'center',
    boxShadow:
      '0 8px 30px rgba(15,23,42,0.05)'
  },

  emptyIcon: {
    fontSize: '3rem'
  },

  loadingSpinner: {
    fontSize: '2rem'
  },

  // FOOTER
  footer: {
    background: '#0f172a',
    color: '#94a3b8',
    padding: '20px 5%',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    flexWrap: 'wrap',
    fontSize: '0.8rem'
  },

  fullScreenLoader: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8fafc',
    color: '#334155'
  }
};

export default Admin;
