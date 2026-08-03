import React, { useEffect, useMemo, useState } from 'react';
import { db, auth } from '../firebase';

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy
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
  const [loginError, setLoginError] = useState('');

  // =========================
  // DATA
  // =========================
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [dataLoading, setDataLoading] = useState(false);
  const [dataError, setDataError] = useState('');

  // =========================
  // UI
  // =========================
  const [activeTab, setActiveTab] = useState('bookings');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // =========================
  // AUTH LISTENER
  // =========================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);

      if (!currentUser) {
        setBookings([]);
        setReviews([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // =========================
  // FETCH DATA AFTER LOGIN
  // =========================
  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  // =========================
  // FETCH BOOKINGS + REVIEWS
  // =========================
  const fetchAllData = async () => {
    setDataLoading(true);
    setDataError('');

    try {
      // -------------------------
      // BOOKINGS
      // -------------------------
      try {
        const bookingsRef = collection(db, 'bookings');

        const bookingsQuery = query(
          bookingsRef,
          orderBy('createdAt', 'desc')
        );

        const bookingSnapshot = await getDocs(bookingsQuery);

        const bookingData = bookingSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        setBookings(bookingData);
      } catch (bookingError) {
        console.error('Bookings error:', bookingError);

        // fallback if createdAt/orderBy causes an error
        const bookingSnapshot = await getDocs(
          collection(db, 'bookings')
        );

        const bookingData = bookingSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        setBookings(bookingData);
      }

      // -------------------------
      // REVIEWS
      // -------------------------
      try {
        const reviewsSnapshot = await getDocs(
          collection(db, 'reviews')
        );

        const reviewsData = reviewsSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data()
        }));

        setReviews(reviewsData);
      } catch (reviewError) {
        console.error('Reviews error:', reviewError);

        // Reviews collection may not exist yet.
        setReviews([]);
      }

    } catch (error) {
      console.error('Dashboard error:', error);

      setDataError(
        'Unable to load dashboard data. Please check your Firebase connection.'
      );
    } finally {
      setDataLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginError('');
    setLoginLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      setEmail('');
      setPassword('');

    } catch (error) {
      console.error(error);

      setLoginError(
        'Incorrect email or password. Please try again.'
      );
    } finally {
      setLoginLoading(false);
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // =========================
  // CONFIRM BOOKING
  // =========================
  const confirmBooking = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'Confirmed',
        confirmedAt: new Date().toISOString()
      });

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status: 'Confirmed',
                confirmedAt: new Date().toISOString()
              }
            : booking
        )
      );

    } catch (error) {
      console.error(error);
      alert('Unable to confirm this booking.');
    }
  };

  // =========================
  // CANCEL BOOKING
  // =========================
  const cancelBooking = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'Cancelled',
        cancelledAt: new Date().toISOString()
      });

      setBookings((previous) =>
        previous.map((booking) =>
          booking.id === id
            ? {
                ...booking,
                status: 'Cancelled'
              }
            : booking
        )
      );

    } catch (error) {
      console.error(error);
      alert('Unable to cancel this booking.');
    }
  };

  // =========================
  // DELETE BOOKING
  // =========================
  const deleteBooking = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete this booking?'
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'bookings', id));

      setBookings((previous) =>
        previous.filter((booking) => booking.id !== id)
      );

    } catch (error) {
      console.error(error);
      alert('Unable to delete booking.');
    }
  };

  // =========================
  // DELETE REVIEW
  // =========================
  const deleteReview = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this review?'
    );

    if (!confirmed) return;

    try {
      await deleteDoc(doc(db, 'reviews', id));

      setReviews((previous) =>
        previous.filter((review) => review.id !== id)
      );

    } catch (error) {
      console.error(error);
      alert('Unable to delete review.');
    }
  };

  // =========================
  // HELPERS
  // =========================
  const getStatus = (status) => {
    if (!status) return 'Pending';

    const value = String(status).toLowerCase();

    if (value.includes('confirm')) return 'Confirmed';
    if (value.includes('cancel')) return 'Cancelled';

    return 'Pending';
  };

  const getStatusStyle = (status) => {
    const normalized = getStatus(status);

    if (normalized === 'Confirmed') {
      return {
        background: '#dcfce7',
        color: '#15803d'
      };
    }

    if (normalized === 'Cancelled') {
      return {
        background: '#fee2e2',
        color: '#b91c1c'
      };
    }

    return {
      background: '#fef3c7',
      color: '#b45309'
    };
  };

  const getReviewName = (review) => {
    return (
      review.name ||
      review.userName ||
      review.username ||
      'Anonymous'
    );
  };

  const getReviewText = (review) => {
    return (
      review.text ||
      review.comment ||
      review.reviewText ||
      'No comment'
    );
  };

  // =========================
  // STATISTICS
  // =========================
  const statistics = useMemo(() => {
    const total = bookings.length;

    const confirmed = bookings.filter(
      (b) => getStatus(b.status) === 'Confirmed'
    ).length;

    const pending = bookings.filter(
      (b) => getStatus(b.status) === 'Pending'
    ).length;

    const cancelled = bookings.filter(
      (b) => getStatus(b.status) === 'Cancelled'
    ).length;

    return {
      total,
      confirmed,
      pending,
      cancelled,
      reviews: reviews.length
    };
  }, [bookings, reviews]);

  // =========================
  // FILTER BOOKINGS
  // =========================
  const filteredBookings = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return bookings.filter((booking) => {
      const normalizedStatus = getStatus(booking.status);

      const matchesStatus =
        statusFilter === 'All' ||
        normalizedStatus === statusFilter;

      const searchableText = `
        ${booking.name || ''}
        ${booking.phone || ''}
        ${booking.room || ''}
        ${booking.checkIn || ''}
        ${booking.checkOut || ''}
      `.toLowerCase();

      const matchesSearch =
        !keyword || searchableText.includes(keyword);

      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, statusFilter]);

  // =========================
  // LOADING SCREEN
  // =========================
  if (authLoading) {
    return (
      <div style={styles.fullScreen}>
        <div style={styles.loaderBox}>
          <div style={styles.spinner}></div>
          <h3 style={{ marginTop: 20 }}>
            Loading Admin Dashboard...
          </h3>
        </div>
      </div>
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================
  if (!user) {
    return (
      <div style={styles.loginPage}>
        <div style={styles.loginCard}>

          <div style={styles.logoCircle}>
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

          <form onSubmit={handleLogin}>

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

            {loginError && (
              <div style={styles.errorBox}>
                ❌ {loginError}
              </div>
            )}

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

          <p style={styles.loginFooter}>
            Z Addis Hotel Management System
          </p>

        </div>
      </div>
    );
  }

  // =========================
  // ADMIN DASHBOARD
  // =========================
  return (
    <div style={styles.dashboard}>

      {/* TOP HEADER */}
      <header style={styles.header}>

        <div>
          <div style={styles.brand}>
            🏨 Z ADDIS HOTEL
          </div>

          <div style={styles.headerSubtitle}>
            Management Dashboard
          </div>
        </div>

        <div style={styles.headerActions}>

          <button
            onClick={fetchAllData}
            style={styles.refreshButton}
            disabled={dataLoading}
          >
            🔄 {dataLoading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            🚪 Logout
          </button>

        </div>

      </header>

      {/* ERROR */}
      {dataError && (
        <div style={styles.errorBanner}>
          ⚠️ {dataError}
        </div>
      )}

      {/* WELCOME */}
      <section style={styles.welcomeSection}>

        <div>
          <h1 style={styles.welcomeTitle}>
            Welcome back, Admin 👋
          </h1>

          <p style={styles.welcomeText}>
            Manage hotel bookings and customer reviews from one place.
          </p>
        </div>

        <div style={styles.adminEmail}>
          👤 {user.email}
        </div>

      </section>

      {/* STATISTICS */}
      <section style={styles.statsGrid}>

        <StatCard
          icon="📅"
          title="Total Bookings"
          value={statistics.total}
          description="All reservations"
          background="#eff6ff"
          iconBackground="#2563eb"
        />

        <StatCard
          icon="✅"
          title="Confirmed"
          value={statistics.confirmed}
          description="Confirmed reservations"
          background="#f0fdf4"
          iconBackground="#16a34a"
        />

        <StatCard
          icon="⏳"
          title="Pending"
          value={statistics.pending}
          description="Waiting for confirmation"
          background="#fffbeb"
          iconBackground="#f59e0b"
        />

        <StatCard
          icon="⭐"
          title="Reviews"
          value={statistics.reviews}
          description="Customer reviews"
          background="#fff7ed"
          iconBackground="#ea580c"
        />

      </section>

      {/* MAIN PANEL */}
      <section style={styles.mainCard}>

        {/* TABS */}
        <div style={styles.tabs}>

          <button
            onClick={() => setActiveTab('bookings')}
            style={{
              ...styles.tab,
              ...(activeTab === 'bookings'
                ? styles.activeTab
                : {})
            }}
          >
            📅 Bookings
            <span style={styles.tabCount}>
              {bookings.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              ...styles.tab,
              ...(activeTab === 'reviews'
                ? styles.activeTab
                : {})
            }}
          >
            ⭐ Reviews
            <span style={styles.tabCount}>
              {reviews.length}
            </span>
          </button>

        </div>

        {/* ================= BOOKINGS ================= */}
        {activeTab === 'bookings' && (
          <div>

            <div style={styles.sectionHeader}>

              <div>
                <h2 style={styles.sectionTitle}>
                  Hotel Bookings
                </h2>

                <p style={styles.sectionDescription}>
                  View and manage customer reservations.
                </p>
              </div>

              <div style={styles.filters}>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="🔎 Search booking..."
                  style={styles.searchInput}
                />

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
                  }
                  style={styles.select}
                >
                  <option value="All">
                    All Status
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>

              </div>

            </div>

            {dataLoading ? (
              <LoadingData />
            ) : filteredBookings.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No bookings found"
                text="There are no bookings matching your search."
              />
            ) : (
              <div style={styles.tableWrapper}>

                <table style={styles.table}>

                  <thead>
                    <tr>
                      <th style={styles.th}>
                        Guest
                      </th>

                      <th style={styles.th}>
                        Room
                      </th>

                      <th style={styles.th}>
                        Guests
                      </th>

                      <th style={styles.th}>
                        Stay
                      </th>

                      <th style={styles.th}>
                        Status
                      </th>

                      <th style={styles.th}>
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredBookings.map((booking) => {

                      const statusStyle =
                        getStatusStyle(
                          booking.status
                        );

                      return (
                        <tr
                          key={booking.id}
                          style={styles.tr}
                        >

                          {/* GUEST */}
                          <td style={styles.td}>

                            <div style={styles.guestName}>
                              {booking.name ||
                                'Unknown Guest'}
                            </div>

                            <div style={styles.phone}>
                              📞 {booking.phone ||
                                'No phone'}
                            </div>

                          </td>

                          {/* ROOM */}
                          <td style={styles.td}>

                            <div style={styles.roomName}>
                              {booking.room ||
                                'Room'}
                            </div>

                            {booking.price && (
                              <div style={styles.price}>
                                💰 {booking.price}
                              </div>
                            )}

                          </td>

                          {/* GUEST COUNT */}
                          <td style={styles.td}>

                            <div>
                              👨 Adults:{' '}
                              {booking.adults ||
                                1}
                            </div>

                            <div>
                              👶 Children:{' '}
                              {booking.children ||
                                0}
                            </div>

                            {booking.rooms && (
                              <div>
                                🛏 Rooms:{' '}
                                {booking.rooms}
                              </div>
                            )}

                          </td>

                          {/* DATES */}
                          <td style={styles.td}>

                            <div style={styles.date}>
                              📅{' '}
                              {booking.checkIn ||
                                '-'}
                            </div>

                            <div style={styles.date}>
                              🏁{' '}
                              {booking.checkOut ||
                                '-'}
                            </div>

                          </td>

                          {/* STATUS */}
                          <td style={styles.td}>

                            <span
                              style={{
                                ...styles.statusBadge,
                                background:
                                  statusStyle.background,
                                color:
                                  statusStyle.color
                              }}
                            >
                              {getStatus(
                                booking.status
                              )}
                            </span>

                          </td>

                          {/* ACTIONS */}
                          <td style={styles.td}>

                            <div style={styles.actionGroup}>

                              {getStatus(
                                booking.status
                              ) !== 'Confirmed' && (
                                <button
                                  onClick={() =>
                                    confirmBooking(
                                      booking.id
                                    )
                                  }
                                  style={
                                    styles.confirmButton
                                  }
                                >
                                  ✓ Confirm
                                </button>
                              )}

                              {getStatus(
                                booking.status
                              ) !== 'Cancelled' && (
                                <button
                                  onClick={() =>
                                    cancelBooking(
                                      booking.id
                                    )
                                  }
                                  style={
                                    styles.cancelButton
                                  }
                                >
                                  × Cancel
                                </button>
                              )}

                              <button
                                onClick={() =>
                                  deleteBooking(
                                    booking.id
                                  )
                                }
                                style={
                                  styles.deleteButton
                                }
                              >
                                🗑 Delete
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        )}

        {/* ================= REVIEWS ================= */}
        {activeTab === 'reviews' && (
          <div>

            <div style={styles.sectionHeader}>

              <div>
                <h2 style={styles.sectionTitle}>
                  Customer Reviews
                </h2>

                <p style={styles.sectionDescription}>
                  Review and manage customer feedback.
                </p>
              </div>

            </div>

            {dataLoading ? (
              <LoadingData />
            ) : reviews.length === 0 ? (
              <EmptyState
                icon="⭐"
                title="No reviews yet"
                text="Customer reviews will appear here."
              />
            ) : (
              <div style={styles.reviewGrid}>

                {reviews.map((review) => {

                  const rating =
                    Math.min(
                      5,
                      Math.max(
                        0,
                        Number(review.rating) || 5
                      )
                    );

                  return (
                    <div
                      key={review.id}
                      style={styles.reviewCard}
                    >

                      <div style={styles.reviewTop}>

                        <div style={styles.avatar}>
                          {getReviewName(
                            review
                          )
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>

                          <h3
                            style={
                              styles.reviewerName
                            }
                          >
                            {getReviewName(
                              review
                            )}
                          </h3>

                          <div
                            style={
                              styles.stars
                            }
                          >
                            {'★'.repeat(
                              rating
                            )}
                            {'☆'.repeat(
                              5 - rating
                            )}
                          </div>

                        </div>

                      </div>

                      <p style={styles.reviewText}>
                        "{getReviewText(
                          review
                        )}"
                      </p>

                      <button
                        onClick={() =>
                          deleteReview(
                            review.id
                          )
                        }
                        style={
                          styles.reviewDelete
                        }
                      >
                        🗑 Delete Review
                      </button>

                    </div>
                  );
                })}

              </div>
            )}

          </div>
        )}

      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div>
          © {new Date().getFullYear()} Z Addis Hotel
        </div>

        <div>
          Admin Management System
        </div>
      </footer>

    </div>
  );
};

// ======================================================
// STAT CARD
// ======================================================

const StatCard = ({
  icon,
  title,
  value,
  description,
  background,
  iconBackground
}) => {
  return (
    <div
      style={{
        ...styles.statCard,
        background
      }}
    >

      <div
        style={{
          ...styles.statIcon,
          background: iconBackground
        }}
      >
        {icon}
      </div>

      <div style={{ flex: 1 }}>

        <div style={styles.statTitle}>
          {title}
        </div>

        <div style={styles.statValue}>
          {value}
        </div>

        <div style={styles.statDescription}>
          {description}
        </div>

      </div>

    </div>
  );
};

// ======================================================
// LOADING
// ======================================================

const LoadingData = () => {
  return (
    <div style={styles.loadingData}>
      <div style={styles.spinner}></div>
      <p>Loading data...</p>
    </div>
  );
};

// ======================================================
// EMPTY
// ======================================================

const EmptyState = ({
  icon,
  title,
  text
}) => {
  return (
    <div style={styles.emptyState}>

      <div style={styles.emptyIcon}>
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>
  );
};

// ======================================================
// STYLES
// ======================================================

const styles = {

  fullScreen: {
    minHeight: '100vh',
    background: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },

  loaderBox: {
    textAlign: 'center',
    color: '#334155'
  },

  spinner: {
    width: '42px',
    height: '42px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #e67e22',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    margin: '0 auto'
  },

  // LOGIN

  loginPage: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg, #0f172a, #1e293b)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxSizing: 'border-box'
  },

  loginCard: {
    width: '100%',
    maxWidth: '430px',
    background: '#ffffff',
    borderRadius: '24px',
    padding: '42px',
    boxShadow:
      '0 25px 70px rgba(0,0,0,0.35)',
    boxSizing: 'border-box'
  },

  logoCircle: {
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background:
      'linear-gradient(135deg, #e67e22, #f39c12)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '34px',
    margin: '0 auto 20px'
  },

  loginTitle: {
    textAlign: 'center',
    margin: 0,
    color: '#0f172a',
    fontSize: '28px'
  },

  loginSubtitle: {
    textAlign: 'center',
    color: '#64748b',
    marginTop: '8px'
  },

  secureBadge: {
    background: '#fff7ed',
    color: '#c2410c',
    padding: '10px',
    borderRadius: '10px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
    margin: '25px 0'
  },

  label: {
    display: 'block',
    color: '#334155',
    fontWeight: '600',
    fontSize: '14px',
    marginBottom: '7px'
  },

  input: {
    width: '100%',
    padding: '14px',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    fontSize: '15px',
    marginBottom: '18px',
    boxSizing: 'border-box',
    outline: 'none'
  },

  loginButton: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '10px',
    background:
      'linear-gradient(135deg, #e67e22, #f39c12)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer'
  },

  loginFooter: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '12px',
    marginTop: '25px',
    marginBottom: 0
  },

  errorBox: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '15px',
    fontSize: '13px'
  },

  // DASHBOARD

  dashboard: {
    minHeight: '100vh',
    background: '#f8fafc',
    fontFamily:
      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: '#0f172a',
    paddingBottom: '40px'
  },

  header: {
    background: '#0f172a',
    color: '#fff',
    padding: '20px 5%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },

  brand: {
    fontSize: '22px',
    fontWeight: '800',
    letterSpacing: '0.5px'
  },

  headerSubtitle: {
    color: '#94a3b8',
    fontSize: '13px',
    marginTop: '4px'
  },

  headerActions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },

  refreshButton: {
    padding: '10px 16px',
    border: '1px solid #475569',
    background: '#1e293b',
    color: '#fff',
    borderRadius: '9px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  logoutButton: {
    padding: '10px 16px',
    border: 'none',
    background: '#ef4444',
    color: '#fff',
    borderRadius: '9px',
    cursor: 'pointer',
    fontWeight: '600'
  },

  errorBanner: {
    margin: '20px 5% 0',
    background: '#fee2e2',
    color: '#991b1b',
    padding: '14px 18px',
    borderRadius: '10px'
  },

  welcomeSection: {
    margin: '35px 5% 25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },

  welcomeTitle: {
    margin: 0,
    fontSize: '30px'
  },

  welcomeText: {
    margin: '8px 0 0',
    color: '#64748b'
  },

  adminEmail: {
    background: '#fff',
    padding: '12px 18px',
    borderRadius: '12px',
    boxShadow:
      '0 4px 20px rgba(15,23,42,0.06)',
    color: '#475569',
    fontSize: '14px'
  },

  statsGrid: {
    margin: '0 5% 30px',
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '18px'
  },

  statCard: {
    borderRadius: '18px',
    padding: '22px',
    display: 'flex',
    alignItems: 'center',
    gap: '17px',
    boxShadow:
      '0 5px 20px rgba(15,23,42,0.05)'
  },

  statIcon: {
    width: '55px',
    height: '55px',
    borderRadius: '15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    color: '#fff',
    flexShrink: 0
  },

  statTitle: {
    color: '#64748b',
    fontSize: '13px',
    fontWeight: '600'
  },

  statValue: {
    fontSize: '30px',
    fontWeight: '800',
    marginTop: '3px'
  },

  statDescription: {
    color: '#94a3b8',
    fontSize: '12px'
  },

  mainCard: {
    background: '#fff',
    margin: '0 5%',
    borderRadius: '20px',
    boxShadow:
      '0 8px 30px rgba(15,23,42,0.06)',
    overflow: 'hidden'
  },

  tabs: {
    display: 'flex',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 25px',
    gap: '8px'
  },

  tab: {
    padding: '18px 20px',
    border: 'none',
    background: 'transparent',
    color: '#64748b',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    borderBottom: '3px solid transparent'
  },

  activeTab: {
    color: '#e67e22',
    borderBottom: '3px solid #e67e22'
  },

  tabCount: {
    marginLeft: '8px',
    background: '#f1f5f9',
    padding: '3px 8px',
    borderRadius: '20px',
    fontSize: '11px'
  },

  sectionHeader: {
    padding: '25px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    flexWrap: 'wrap'
  },

  sectionTitle: {
    margin: 0,
    fontSize: '21px'
  },

  sectionDescription: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: '13px'
  },

  filters: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },

  searchInput: {
    padding: '11px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    minWidth: '220px',
    outline: 'none'
  },

  select: {
    padding: '11px 14px',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    background: '#fff',
    cursor: 'pointer'
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '950px'
  },

  th: {
    background: '#f8fafc',
    color: '#475569',
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    padding: '14px 18px',
    textAlign: 'left',
    borderBottom: '1px solid #e2e8f0'
  },

  tr: {
    borderBottom: '1px solid #f1f5f9'
  },

  td: {
    padding: '16px 18px',
    verticalAlign: 'middle',
    fontSize: '13px'
  },

  guestName: {
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '5px'
  },

  phone: {
    color: '#64748b',
    fontSize: '12px'
  },

  roomName: {
    fontWeight: '700'
  },

  price: {
    color: '#e67e22',
    fontSize: '12px',
    marginTop: '4px'
  },

  date: {
    fontSize: '12px',
    marginBottom: '5px',
    color: '#475569'
  },

  statusBadge: {
    padding: '6px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '800'
  },

  actionGroup: {
    display: 'flex',
    gap: '5px',
    flexWrap: 'wrap'
  },

  confirmButton: {
    background: '#16a34a',
    color: '#fff',
    border: 'none',
    padding: '7px 9px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700'
  },

  cancelButton: {
    background: '#f59e0b',
    color: '#fff',
    border: 'none',
    padding: '7px 9px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700'
  },

  deleteButton: {
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    padding: '7px 9px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '11px',
    fontWeight: '700'
  },

  // REVIEWS

  reviewGrid: {
    padding: '0 25px 30px',
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '18px'
  },

  reviewCard: {
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    padding: '20px',
    background: '#fff'
  },

  reviewTop: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },

  avatar: {
    width: '45px',
    height: '45px',
    borderRadius: '50%',
    background:
      'linear-gradient(135deg, #e67e22, #f39c12)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
    fontSize: '18px'
  },

  reviewerName: {
    margin: 0,
    fontSize: '15px'
  },

  stars: {
    color: '#f59e0b',
    marginTop: '4px',
    letterSpacing: '2px'
  },

  reviewText: {
    color: '#475569',
    lineHeight: '1.7',
    fontSize: '14px',
    minHeight: '65px'
  },

  reviewDelete: {
    width: '100%',
    padding: '9px',
    background: '#fee2e2',
    color: '#b91c1c',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '700'
  },

  loadingData: {
    padding: '60px',
    textAlign: 'center',
    color: '#64748b'
  },

  emptyState: {
    padding: '70px 20px',
    textAlign: 'center',
    color: '#64748b'
  },

  emptyIcon: {
    fontSize: '50px',
    marginBottom: '15px'
  },

  footer: {
    margin: '30px 5% 0',
    padding: '20px 0',
    borderTop: '1px solid #e2e8f0',
    color: '#94a3b8',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '15px',
    flexWrap: 'wrap',
    fontSize: '12px'
  }
};

export default Admin;
