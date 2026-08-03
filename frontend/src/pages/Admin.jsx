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
  const [user, setUser] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [messages, setMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');

  const [search, setSearch] = useState('');

  // =========================================================
  // AUTH
  // =========================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        fetchAllData();
      } else {
        setBookings([]);
        setReviews([]);
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // =========================================================
  // FETCH ALL DATA
  // =========================================================

  const fetchAllData = async () => {
    setLoading(true);

    try {
      // BOOKINGS
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

      // REVIEWS
      const reviewsSnapshot = await getDocs(
        collection(db, 'reviews')
      );

      const reviewsData = reviewsSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      setReviews(reviewsData);

      // MESSAGES
      const messagesQuery = query(
        collection(db, 'messages'),
        orderBy('createdAt', 'desc')
      );

      const messagesSnapshot = await getDocs(messagesQuery);

      const messagesData = messagesSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      setMessages(messagesData);

    } catch (error) {
      console.error('Error fetching data:', error);

      // If createdAt orderBy causes an index/timestamp problem,
      // still try to fetch the collections normally.
      try {
        const bookingsSnapshot = await getDocs(
          collection(db, 'bookings')
        );

        setBookings(
          bookingsSnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );

        const messagesSnapshot = await getDocs(
          collection(db, 'messages')
        );

        setMessages(
          messagesSnapshot.docs.map((item) => ({
            id: item.id,
            ...item.data()
          }))
        );
      } catch (fallbackError) {
        console.error(
          'Fallback fetch error:',
          fallbackError
        );
      }
    }

    setLoading(false);
  };

  // =========================================================
  // LOGIN
  // =========================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoginLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      setEmail('');
      setPassword('');

    } catch (error) {
      console.error(error);

      alert(
        '❌ የተሳሳተ ኢሜይል ወይም የይለፍ ቃል!\n\nPlease check your email and password.'
      );
    }

    setLoginLoading(false);
  };

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================================================
  // BOOKING STATUS
  // =========================================================

  const handleStatusChange = async (id, status) => {
    try {
      await updateDoc(
        doc(db, 'bookings', id),
        {
          status
        }
      );

      await fetchAllData();

    } catch (error) {
      console.error(error);

      alert(
        'Unable to update booking status.'
      );
    }
  };

  // =========================================================
  // DELETE BOOKING
  // =========================================================

  const handleDeleteBooking = async (id) => {
    const confirmed = window.confirm(
      'ይህንን booking ማጥፋት ይፈልጋሉ?\n\nAre you sure you want to delete this booking?'
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, 'bookings', id)
      );

      await fetchAllData();

    } catch (error) {
      console.error(error);

      alert(
        'Unable to delete booking.'
      );
    }
  };

  // =========================================================
  // DELETE REVIEW
  // =========================================================

  const handleDeleteReview = async (id) => {
    const confirmed = window.confirm(
      'ይህንን review ማጥፋት ይፈልጋሉ?\n\nAre you sure you want to delete this review?'
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, 'reviews', id)
      );

      await fetchAllData();

    } catch (error) {
      console.error(error);

      alert(
        'Unable to delete review.'
      );
    }
  };

  // =========================================================
  // MESSAGE STATUS
  // =========================================================

  const handleMessageStatus = async (
    id,
    currentStatus
  ) => {
    try {
      await updateDoc(
        doc(db, 'messages', id),
        {
          status:
            currentStatus === 'read'
              ? 'unread'
              : 'read'
        }
      );

      await fetchAllData();

    } catch (error) {
      console.error(error);

      alert(
        'Unable to update message.'
      );
    }
  };

  // =========================================================
  // DELETE MESSAGE
  // =========================================================

  const handleDeleteMessage = async (id) => {
    const confirmed = window.confirm(
      'ይህንን message ማጥፋት ይፈልጋሉ?\n\nAre you sure you want to delete this message?'
    );

    if (!confirmed) return;

    try {
      await deleteDoc(
        doc(db, 'messages', id)
      );

      await fetchAllData();

    } catch (error) {
      console.error(error);

      alert(
        'Unable to delete message.'
      );
    }
  };

  // =========================================================
  // STATISTICS
  // =========================================================

  const confirmedBookings = bookings.filter(
    (b) =>
      b.status?.includes('Confirmed')
  ).length;

  const pendingBookings = bookings.filter(
    (b) =>
      !b.status?.includes('Confirmed')
  ).length;

  const unreadMessages = messages.filter(
    (m) =>
      m.status !== 'read'
  ).length;

  const totalReviews = reviews.length;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return '0.0';

    const total = reviews.reduce(
      (sum, review) =>
        sum +
        (Number(review.rating) || 0),
      0
    );

    return (
      total / reviews.length
    ).toFixed(1);
  }, [reviews]);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredBookings = bookings.filter(
    (b) => {
      const text = `
        ${b.name || ''}
        ${b.phone || ''}
        ${b.room || ''}
      `.toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    }
  );

  const filteredMessages = messages.filter(
    (m) => {
      const text = `
        ${m.name || ''}
        ${m.phone || ''}
        ${m.email || ''}
        ${m.message || ''}
      `.toLowerCase();

      return text.includes(
        search.toLowerCase()
      );
    }
  );

  // =========================================================
  // LOGIN PAGE
  // =========================================================

  if (!user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            'linear-gradient(135deg,#0f172a,#1e293b)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          fontFamily:
            "'Segoe UI', Tahoma, sans-serif"
        }}
      >

        <form
          onSubmit={handleLogin}
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#fff',
            padding: '45px',
            borderRadius: '25px',
            boxShadow:
              '0 25px 70px rgba(0,0,0,0.35)',
            boxSizing: 'border-box'
          }}
        >

          <div
            style={{
              width: '75px',
              height: '75px',
              borderRadius: '22px',
              background:
                'linear-gradient(135deg,#e67e22,#f39c12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.3rem',
              margin:
                '0 auto 20px'
            }}
          >
            🔐
          </div>

          <h1
            style={{
              textAlign: 'center',
              color: '#172033',
              margin: '0 0 8px'
            }}
          >
            Z Addis Hotel
          </h1>

          <p
            style={{
              textAlign: 'center',
              color: '#6b7280',
              marginBottom: '30px'
            }}
          >
            Secure Admin Dashboard
          </p>

          <label
            style={{
              display: 'block',
              fontWeight: '700',
              marginBottom: '8px'
            }}
          >
            Admin Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="admin@example.com"
            required
            style={inputStyle}
          />

          <label
            style={{
              display: 'block',
              fontWeight: '700',
              margin:
                '18px 0 8px'
            }}
          >
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter password"
            required
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loginLoading}
            style={{
              width: '100%',
              marginTop: '25px',
              padding: '15px',
              border: 'none',
              borderRadius: '12px',
              background:
                loginLoading
                  ? '#9ca3af'
                  : 'linear-gradient(135deg,#e67e22,#f39c12)',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: '800',
              cursor:
                loginLoading
                  ? 'not-allowed'
                  : 'pointer'
            }}
          >
            {loginLoading
              ? 'Logging in...'
              : '🔓 Login'}
          </button>

        </form>
      </div>
    );
  }

  // =========================================================
  // ADMIN DASHBOARD
  // =========================================================

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        fontFamily:
          "'Segoe UI', Tahoma, sans-serif",
        color: '#172033'
      }}
    >

      {/* HEADER */}

      <header
        style={{
          background:
            'linear-gradient(135deg,#0f172a,#1e293b)',
          color: '#fff',
          padding:
            '25px clamp(20px,5vw,60px)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
          boxShadow:
            '0 5px 25px rgba(0,0,0,0.15)'
        }}
      >

        <div
          style={{
            maxWidth: '1400px',
            margin: 'auto',
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}
        >

          <div>

            <div
              style={{
                color: '#f39c12',
                fontWeight: '800',
                fontSize: '0.8rem',
                letterSpacing: '1px'
              }}
            >
              Z ADDIS HOTEL
            </div>

            <h1
              style={{
                margin: '5px 0 0',
                fontSize:
                  'clamp(1.4rem,3vw,2rem)'
              }}
            >
              🛡️ Admin Dashboard
            </h1>

          </div>


          <div
            style={{
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
              flexWrap: 'wrap'
            }}
          >

            <span
              style={{
                background:
                  'rgba(255,255,255,0.08)',
                padding:
                  '9px 14px',
                borderRadius: '10px',
                fontSize:
                  '0.85rem',
                color: '#cbd5e1'
              }}
            >
              {user.email}
            </span>

            <button
              onClick={fetchAllData}
              style={{
                ...smallButton,
                background: '#2563eb'
              }}
            >
              🔄 Refresh
            </button>

            <button
              onClick={handleLogout}
              style={{
                ...smallButton,
                background: '#dc2626'
              }}
            >
              🔒 Logout
            </button>

          </div>

        </div>

      </header>


      <main
        style={{
          maxWidth: '1400px',
          margin: 'auto',
          padding:
            '35px clamp(15px,4vw,45px) 70px'
        }}
      >

        {/* STAT CARDS */}

        <div
          className="admin-stats"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4,1fr)',
            gap: '20px',
            marginBottom: '30px'
          }}
        >

          <StatCard
            icon="📅"
            title="Total Bookings"
            value={bookings.length}
            color="#2563eb"
          />

          <StatCard
            icon="⏳"
            title="Pending"
            value={pendingBookings}
            color="#f59e0b"
          />

          <StatCard
            icon="💬"
            title="Unread Messages"
            value={unreadMessages}
            color="#e67e22"
          />

          <StatCard
            icon="⭐"
            title="Reviews"
            value={`${averageRating} / 5`}
            subtitle={`${totalReviews} reviews`}
            color="#f59e0b"
          />

        </div>


        {/* NAVIGATION */}

        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '8px',
            display: 'flex',
            gap: '5px',
            marginBottom: '30px',
            boxShadow:
              '0 5px 20px rgba(0,0,0,0.06)',
            overflowX: 'auto'
          }}
        >

          <NavButton
            active={
              activeTab === 'overview'
            }
            onClick={() =>
              setActiveTab('overview')
            }
          >
            📊 Overview
          </NavButton>

          <NavButton
            active={
              activeTab === 'bookings'
            }
            onClick={() =>
              setActiveTab('bookings')
            }
          >
            📅 Bookings
            {bookings.length > 0 && (
              <Badge>
                {bookings.length}
              </Badge>
            )}
          </NavButton>

          <NavButton
            active={
              activeTab === 'messages'
            }
            onClick={() =>
              setActiveTab('messages')
            }
          >
            💬 Messages
            {unreadMessages > 0 && (
              <Badge>
                {unreadMessages}
              </Badge>
            )}
          </NavButton>

          <NavButton
            active={
              activeTab === 'reviews'
            }
            onClick={() =>
              setActiveTab('reviews')
            }
          >
            ⭐ Reviews
          </NavButton>

        </div>


        {/* SEARCH */}

        {(activeTab === 'bookings' ||
          activeTab === 'messages') && (

          <div
            style={{
              marginBottom: '20px'
            }}
          >

            <input
              type="search"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder={
                activeTab === 'bookings'
                  ? '🔍 Search bookings by name, phone or room...'
                  : '🔍 Search messages by name, phone, email...'
              }
              style={{
                ...inputStyle,
                maxWidth: '600px',
                background: '#fff'
              }}
            />

          </div>

        )}


        {/* LOADING */}

        {loading ? (

          <div
            style={{
              background: '#fff',
              padding: '70px 20px',
              borderRadius: '20px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '3rem'
              }}
            >
              ⏳
            </div>

            <h3>
              Loading dashboard...
            </h3>

          </div>

        ) : (

          <>

            {/* =================================================
                OVERVIEW
            ================================================= */}

            {activeTab === 'overview' && (

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap: '25px'
                }}
                className="overview-grid"
              >

                {/* RECENT BOOKINGS */}

                <section
                  style={panelStyle}
                >

                  <SectionHeader
                    title="Recent Bookings"
                    icon="📅"
                    onClick={() =>
                      setActiveTab(
                        'bookings'
                      )
                    }
                  />

                  {bookings.length === 0 ? (

                    <EmptyState
                      icon="📭"
                      text="No bookings yet"
                    />

                  ) : (

                    bookings
                      .slice(0, 5)
                      .map((booking) => (

                        <BookingMini
                          key={booking.id}
                          booking={booking}
                        />

                      ))

                  )}

                </section>


                {/* MESSAGES */}

                <section
                  style={panelStyle}
                >

                  <SectionHeader
                    title="Customer Messages"
                    icon="💬"
                    onClick={() =>
                      setActiveTab(
                        'messages'
                      )
                    }
                  />

                  {messages.length === 0 ? (

                    <EmptyState
                      icon="📭"
                      text="No messages yet"
                    />

                  ) : (

                    messages
                      .slice(0, 5)
                      .map((message) => (

                        <MessageMini
                          key={message.id}
                          message={message}
                        />

                      ))

                  )}

                </section>


                {/* QUICK SUMMARY */}

                <section
                  style={{
                    ...panelStyle,
                    gridColumn:
                      '1 / -1'
                  }}
                >

                  <SectionHeader
                    title="Quick Summary"
                    icon="📈"
                  />

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(3,1fr)',
                      gap: '15px'
                    }}
                    className="summary-grid"
                  >

                    <SummaryBox
                      title="Confirmed Bookings"
                      value={confirmedBookings}
                      icon="✅"
                    />

                    <SummaryBox
                      title="Pending Bookings"
                      value={pendingBookings}
                      icon="⏳"
                    />

                    <SummaryBox
                      title="Unread Messages"
                      value={unreadMessages}
                      icon="📩"
                    />

                  </div>

                </section>

              </div>

            )}


            {/* =================================================
                BOOKINGS
            ================================================= */}

            {activeTab === 'bookings' && (

              <section style={panelStyle}>

                <SectionHeader
                  title="All Bookings"
                  icon="📅"
                />

                {filteredBookings.length === 0 ? (

                  <EmptyState
                    icon="📭"
                    text="No bookings found"
                  />

                ) : (

                  <div
                    style={{
                      overflowX: 'auto'
                    }}
                  >

                    <table
                      style={tableStyle}
                    >

                      <thead>

                        <tr>

                          <th>Name</th>
                          <th>Phone</th>
                          <th>Room</th>
                          <th>Guests</th>
                          <th>Dates</th>
                          <th>Price</th>
                          <th>Status</th>
                          <th>Actions</th>

                        </tr>

                      </thead>

                      <tbody>

                        {filteredBookings.map(
                          (b) => (

                            <tr key={b.id}>

                              <td>
                                <strong>
                                  {b.name ||
                                    'Unknown'}
                                </strong>
                              </td>

                              <td>
                                {b.phone ||
                                  '-'}
                              </td>

                              <td>
                                <strong>
                                  {b.room ||
                                    '-'}
                                </strong>
                              </td>

                              <td>
                                {b.adults ||
                                  1}{' '}
                                Adults
                                {b.children
                                  ? ` • ${b.children} Children`
                                  : ''}
                                {b.rooms
                                  ? ` • ${b.rooms} Room(s)`
                                  : ''}
                              </td>

                              <td>
                                <div>
                                  {b.checkIn ||
                                    '-'}
                                </div>
                                <small
                                  style={{
                                    color:
                                      '#9ca3af'
                                  }}
                                >
                                  to
                                </small>
                                <div>
                                  {b.checkOut ||
                                    '-'}
                                </div>
                              </td>

                              <td>
                                {b.price ||
                                  '-'}
                              </td>

                              <td>
                                <StatusBadge
                                  status={
                                    b.status
                                  }
                                />
                              </td>

                              <td>

                                <div
                                  style={{
                                    display:
                                      'flex',
                                    gap: '6px',
                                    flexWrap:
                                      'wrap'
                                  }}
                                >

                                  {!b.status?.includes(
                                    'Confirmed'
                                  ) && (

                                    <button
                                      onClick={() =>
                                        handleStatusChange(
                                          b.id,
                                          'Confirmed ✅'
                                        )
                                      }
                                      style={{
                                        ...actionButton,
                                        background:
                                          '#16a34a'
                                      }}
                                    >
                                      ✓ Confirm
                                    </button>

                                  )}

                                  <button
                                    onClick={() =>
                                      handleStatusChange(
                                        b.id,
                                        'Cancelled ❌'
                                      )
                                    }
                                    style={{
                                      ...actionButton,
                                      background:
                                        '#f59e0b'
                                    }}
                                  >
                                    Cancel
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteBooking(
                                        b.id
                                      )
                                    }
                                    style={{
                                      ...actionButton,
                                      background:
                                        '#dc2626'
                                    }}
                                  >
                                    🗑 Delete
                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

              </section>

            )}


            {/* =================================================
                MESSAGES
            ================================================= */}

            {activeTab === 'messages' && (

              <section style={panelStyle}>

                <SectionHeader
                  title="Customer Messages"
                  icon="💬"
                />

                {filteredMessages.length === 0 ? (

                  <EmptyState
                    icon="📭"
                    text="No messages found"
                  />

                ) : (

                  <div
                    style={{
                      display: 'grid',
                      gap: '18px'
                    }}
                  >

                    {filteredMessages.map(
                      (message) => (

                        <div
                          key={message.id}
                          style={{
                            border:
                              message.status !==
                              'read'
                                ? '2px solid #f59e0b'
                                : '1px solid #e5e7eb',
                            borderRadius:
                              '16px',
                            padding: '22px',
                            background:
                              message.status !==
                              'read'
                                ? '#fffaf4'
                                : '#fff'
                          }}
                        >

                          <div
                            style={{
                              display:
                                'flex',
                              justifyContent:
                                'space-between',
                              gap: '20px',
                              flexWrap:
                                'wrap'
                            }}
                          >

                            <div>

                              <h3
                                style={{
                                  margin:
                                    '0 0 8px'
                                }}
                              >
                                {message.name ||
                                  'Anonymous'}
                              </h3>

                              <div
                                style={{
                                  display:
                                    'flex',
                                  gap: '15px',
                                  flexWrap:
                                    'wrap',
                                  color:
                                    '#6b7280',
                                  fontSize:
                                    '0.9rem'
                                }}
                              >

                                <span>
                                  📞{' '}
                                  {message.phone ||
                                    '-'}
                                </span>

                                <span>
                                  ✉️{' '}
                                  {message.email ||
                                    '-'}
                                </span>

                              </div>

                            </div>

                            <StatusBadge
                              status={
                                message.status ===
                                'read'
                                  ? '✓ Read'
                                  : '● Unread'
                              }
                            />

                          </div>


                          <div
                            style={{
                              marginTop:
                                '18px',
                              background:
                                '#f8fafc',
                              padding:
                                '18px',
                              borderRadius:
                                '12px',
                              lineHeight:
                                '1.7',
                              whiteSpace:
                                'pre-wrap'
                            }}
                          >
                            {message.message ||
                              'No message'}
                          </div>


                          <div
                            style={{
                              display:
                                'flex',
                              gap: '8px',
                              marginTop:
                                '15px',
                              flexWrap:
                                'wrap'
                            }}
                          >

                            <button
                              onClick={() =>
                                handleMessageStatus(
                                  message.id,
                                  message.status
                                )
                              }
                              style={{
                                ...actionButton,
                                background:
                                  '#172033'
                              }}
                            >
                              {message.status ===
                              'read'
                                ? '↩ Mark Unread'
                                : '✓ Mark Read'}
                            </button>


                            {message.phone && (

                              <a
                                href={`tel:${message.phone}`}
                                style={{
                                  ...actionButton,
                                  background:
                                    '#16a34a',
                                  textDecoration:
                                    'none'
                                }}
                              >
                                📞 Call
                              </a>

                            )}


                            {message.phone && (

                              <a
                                href={`https://wa.me/${String(
                                  message.phone
                                ).replace(
                                  /\D/g,
                                  ''
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  ...actionButton,
                                  background:
                                    '#25D366',
                                  textDecoration:
                                    'none'
                                }}
                              >
                                💬 WhatsApp
                              </a>

                            )}


                            <button
                              onClick={() =>
                                handleDeleteMessage(
                                  message.id
                                )
                              }
                              style={{
                                ...actionButton,
                                background:
                                  '#dc2626'
                              }}
                            >
                              🗑 Delete
                            </button>

                          </div>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

            )}


            {/* =================================================
                REVIEWS
            ================================================= */}

            {activeTab === 'reviews' && (

              <section style={panelStyle}>

                <SectionHeader
                  title="Customer Reviews"
                  icon="⭐"
                />

                {reviews.length === 0 ? (

                  <EmptyState
                    icon="⭐"
                    text="No reviews yet"
                  />

                ) : (

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(2,1fr)',
                      gap: '20px'
                    }}
                    className="reviews-grid"
                  >

                    {reviews.map(
                      (review) => (

                        <div
                          key={review.id}
                          style={{
                            border:
                              '1px solid #e5e7eb',
                            borderRadius:
                              '16px',
                            padding: '22px',
                            background:
                              '#fff'
                          }}
                        >

                          <div
                            style={{
                              display:
                                'flex',
                              justifyContent:
                                'space-between',
                              gap: '15px'
                            }}
                          >

                            <div>

                              <h3
                                style={{
                                  margin:
                                    '0 0 8px'
                                }}
                              >
                                {review.name ||
                                  review.userName ||
                                  'Anonymous'}
                              </h3>

                              <div
                                style={{
                                  color:
                                    '#f59e0b',
                                  fontSize:
                                    '1.2rem'
                                }}
                              >
                                {'★'.repeat(
                                  Math.min(
                                    5,
                                    Math.max(
                                      0,
                                      Number(
                                        review.rating
                                      ) || 0
                                    )
                                  )
                                )}

                                {'☆'.repeat(
                                  5 -
                                    Math.min(
                                      5,
                                      Math.max(
                                        0,
                                        Number(
                                          review.rating
                                        ) || 0
                                      )
                                    )
                                )}
                              </div>

                            </div>

                            <button
                              onClick={() =>
                                handleDeleteReview(
                                  review.id
                                )
                              }
                              style={{
                                width: '38px',
                                height: '38px',
                                border:
                                  'none',
                                borderRadius:
                                  '10px',
                                background:
                                  '#fee2e2',
                                color:
                                  '#dc2626',
                                cursor:
                                  'pointer',
                                fontSize:
                                  '1rem'
                              }}
                            >
                              🗑
                            </button>

                          </div>


                          <p
                            style={{
                              color:
                                '#4b5563',
                              lineHeight:
                                '1.7',
                              fontStyle:
                                'italic',
                              marginTop:
                                '18px'
                            }}
                          >
                            "
                            {review.text ||
                              review.comment ||
                              review.reviewText ||
                              'No comment'}
                            "
                          </p>

                        </div>

                      )
                    )}

                  </div>

                )}

              </section>

            )}

          </>

        )}

      </main>


      {/* RESPONSIVE */}

      <style>
        {`

          input:focus {
            outline: none;
            border-color: #e67e22 !important;
            box-shadow: 0 0 0 3px rgba(230,126,34,0.12);
          }

          button {
            transition: 0.2s ease;
          }

          button:hover {
            transform: translateY(-1px);
          }

          @media (max-width: 1000px) {

            .admin-stats {
              grid-template-columns: repeat(2,1fr) !important;
            }

            .overview-grid {
              grid-template-columns: 1fr !important;
            }

            .summary-grid {
              grid-template-columns: 1fr !important;
            }

            .reviews-grid {
              grid-template-columns: 1fr !important;
            }

          }

          @media (max-width: 600px) {

            .admin-stats {
              grid-template-columns: 1fr !important;
            }

          }

        `}
      </style>

    </div>
  );
};


// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
  icon,
  title,
  value,
  subtitle,
  color
}) => {

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '18px',
        padding: '23px',
        boxShadow:
          '0 8px 30px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}
    >

      <div
        style={{
          width: '58px',
          height: '58px',
          flexShrink: 0,
          borderRadius: '16px',
          background:
            `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.7rem'
        }}
      >
        {icon}
      </div>

      <div>

        <div
          style={{
            color: '#6b7280',
            fontSize: '0.85rem'
          }}
        >
          {title}
        </div>

        <strong
          style={{
            display: 'block',
            fontSize: '1.7rem',
            color
          }}
        >
          {value}
        </strong>

        {subtitle && (
          <small
            style={{
              color: '#9ca3af'
            }}
          >
            {subtitle}
          </small>
        )}

      </div>

    </div>
  );
};


// =========================================================
// NAV BUTTON
// =========================================================

const NavButton = ({
  active,
  onClick,
  children
}) => {

  return (
    <button
      onClick={onClick}
      style={{
        border: 'none',
        borderRadius: '11px',
        padding:
          '12px 17px',
        background:
          active
            ? '#172033'
            : 'transparent',
        color:
          active
            ? '#fff'
            : '#475569',
        fontWeight: '800',
        cursor: 'pointer',
        whiteSpace:
          'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      {children}
    </button>
  );
};


// =========================================================
// BADGE
// =========================================================

const Badge = ({ children }) => {

  return (
    <span
      style={{
        minWidth: '20px',
        height: '20px',
        padding: '0 6px',
        borderRadius: '20px',
        background: '#e67e22',
        color: '#fff',
        fontSize: '0.7rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {children}
    </span>
  );
};


// =========================================================
// SECTION HEADER
// =========================================================

const SectionHeader = ({
  title,
  icon,
  onClick
}) => {

  return (
    <div
      style={{
        display: 'flex',
        justifyContent:
          'space-between',
        alignItems: 'center',
        marginBottom: '20px'
      }}
    >

      <h2
        style={{
          margin: 0,
          fontSize: '1.25rem'
        }}
      >
        {icon} {title}
      </h2>

      {onClick && (
        <button
          onClick={onClick}
          style={{
            border: 'none',
            background:
              '#f1f5f9',
            color: '#475569',
            borderRadius: '8px',
            padding:
              '8px 12px',
            cursor: 'pointer',
            fontWeight: '700'
          }}
        >
          View All →
        </button>
      )}

    </div>
  );
};


// =========================================================
// BOOKING MINI
// =========================================================

const BookingMini = ({
  booking
}) => {

  return (
    <div
      style={{
        padding:
          '14px 0',
        borderBottom:
          '1px solid #eef0f3',
        display: 'flex',
        justifyContent:
          'space-between',
        gap: '15px',
        alignItems: 'center'
      }}
    >

      <div>

        <strong>
          {booking.name ||
            'Unknown'}
        </strong>

        <div
          style={{
            color: '#6b7280',
            fontSize: '0.85rem',
            marginTop: '4px'
          }}
        >
          {booking.room ||
            '-'}{' '}
          •{' '}
          {booking.checkIn ||
            '-'}
        </div>

      </div>

      <StatusBadge
        status={
          booking.status
        }
      />

    </div>
  );
};


// =========================================================
// MESSAGE MINI
// =========================================================

const MessageMini = ({
  message
}) => {

  return (
    <div
      style={{
        padding:
          '14px 0',
        borderBottom:
          '1px solid #eef0f3',
        display: 'flex',
        gap: '12px'
      }}
    >

      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius:
            '12px',
          background:
            message.status ===
            'read'
              ? '#f1f5f9'
              : '#fff3e8',
          display: 'flex',
          alignItems:
            'center',
          justifyContent:
            'center'
        }}
      >
        💬
      </div>

      <div
        style={{
          minWidth: 0
        }}
      >

        <strong>
          {message.name ||
            'Anonymous'}
        </strong>

        <p
          style={{
            margin:
              '4px 0 0',
            color:
              '#6b7280',
            fontSize:
              '0.85rem',
            overflow:
              'hidden',
            textOverflow:
              'ellipsis',
            whiteSpace:
              'nowrap'
          }}
        >
          {message.message ||
            'No message'}
        </p>

      </div>

    </div>
  );
};


// =========================================================
// SUMMARY BOX
// =========================================================

const SummaryBox = ({
  title,
  value,
  icon
}) => {

  return (
    <div
      style={{
        background:
          '#f8fafc',
        borderRadius:
          '14px',
        padding:
          '20px'
      }}
    >

      <div
        style={{
          fontSize:
            '1.6rem',
          marginBottom:
            '8px'
        }}
      >
        {icon}
      </div>

      <strong
        style={{
          display:
            'block',
          fontSize:
            '1.6rem'
        }}
      >
        {value}
      </strong>

      <span
        style={{
          color:
            '#64748b',
          fontSize:
            '0.85rem'
        }}
      >
        {title}
      </span>

    </div>
  );
};


// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({
  status
}) => {

  const isConfirmed =
    status?.includes(
      'Confirmed'
    );

  const isCancelled =
    status?.includes(
      'Cancelled'
    );

  const isRead =
    status === '✓ Read';

  let background =
    '#fff7ed';

  let color =
    '#c2410c';

  if (isConfirmed) {
    background =
      '#dcfce7';
    color =
      '#15803d';
  }

  if (isCancelled) {
    background =
      '#fee2e2';
    color =
      '#dc2626';
  }

  if (isRead) {
    background =
      '#f1f5f9';
    color =
      '#64748b';
  }

  return (
    <span
      style={{
        display:
          'inline-block',
        padding:
          '7px 11px',
        borderRadius:
          '50px',
        background,
        color,
        fontWeight:
          '800',
        fontSize:
          '0.75rem',
        whiteSpace:
          'nowrap'
      }}
    >
      {status ||
        'Pending ⏳'}
    </span>
  );
};


// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({
  icon,
  text
}) => {

  return (
    <div
      style={{
        textAlign:
          'center',
        padding:
          '45px 20px',
        color:
          '#64748b'
      }}
    >

      <div
        style={{
          fontSize:
            '3rem',
          marginBottom:
            '10px'
        }}
      >
        {icon}
      </div>

      <p>
        {text}
      </p>

    </div>
  );
};


// =========================================================
// STYLES
// =========================================================

const panelStyle = {
  background: '#fff',
  borderRadius: '20px',
  padding: '25px',
  boxShadow:
    '0 8px 30px rgba(0,0,0,0.06)'
};

const inputStyle = {
  width: '100%',
  padding: '14px 15px',
  borderRadius: '11px',
  border:
    '1px solid #dfe3e8',
  background: '#fff',
  color: '#172033',
  fontSize: '1rem',
  boxSizing: 'border-box'
};

const smallButton = {
  border: 'none',
  color: '#fff',
  borderRadius: '9px',
  padding: '9px 14px',
  cursor: 'pointer',
  fontWeight: '800'
};

const actionButton = {
  border: 'none',
  color: '#fff',
  borderRadius: '7px',
  padding: '7px 10px',
  cursor: 'pointer',
  fontWeight: '700',
  fontSize: '0.75rem'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.88rem',
  minWidth: '950px'
};

export default Admin;
