import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Booking = ({ lang }) => {
  const isAm = lang === 'am';

  // =========================
  // ROOM INFORMATION
  // =========================

  const rooms = {
    'Standard Room': {
      am: 'ስታንዳርድ ክፍል',
      en: 'Standard Room',
      price: 1500,
      capacity: 2,
      bedsAm: '1 Queen Size Bed',
      bedsEn: '1 Queen Size Bed',
      image: '/r1.jpg',
      featuresAm: 'ነፃ Wi-Fi • ሙቅ ውሃ • TV • የስራ ቦታ',
      featuresEn: 'Free Wi-Fi • Hot Shower • TV • Work Desk'
    },

    'Twin Room': {
      am: 'ትዊን ክፍል',
      en: 'Twin Room',
      price: 2000,
      capacity: 2,
      bedsAm: '2 Single Beds',
      bedsEn: '2 Single Beds',
      image: '/r2.jpg',
      featuresAm: 'ነፃ Wi-Fi • Balcony • TV • ለቤተሰብ ምቹ',
      featuresEn: 'Free Wi-Fi • Balcony • TV • Family Friendly'
    },

    'Deluxe Room': {
      am: 'ዴሉክስ ክፍል',
      en: 'Deluxe Room',
      price: 3000,
      capacity: 3,
      bedsAm: '1 King Size Bed',
      bedsEn: '1 King Size Bed',
      image: '/r3.jpg',
      featuresAm: 'Mini Bar • City View • Jacuzzi • Luxury Decor',
      featuresEn: 'Mini Bar • City View • Jacuzzi • Luxury Decor'
    },

    'Presidential Suite': {
      am: 'ፕሬዝዳንሻል ስዊት',
      en: 'Presidential Suite',
      price: 5000,
      capacity: 4,
      bedsAm: 'Master King Bed + Living Room',
      bedsEn: 'Master King Bed + Living Room',
      image: '/r4.jpg',
      featuresAm: 'VIP Service • Private Balcony • Free Breakfast',
      featuresEn: 'VIP Service • Private Balcony • Free Breakfast'
    }
  };

  // =========================
  // FORM
  // =========================

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    room: 'Standard Room',
    checkIn: '',
    checkOut: '',
    adults: 1,
    children: 0,
    rooms: 1,
    specialRequest: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({
    type: '',
    text: ''
  });

  const selectedRoom = rooms[formData.room];

  // =========================
  // TODAY
  // =========================

  const today = new Date().toISOString().split('T')[0];

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-US').format(price);

  // =========================
  // INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setMessage({
      type: '',
      text: ''
    });
  };

  // =========================
  // GUEST COUNTER
  // =========================

  const changeGuests = (type, amount) => {
    setFormData((prev) => {
      const current = Number(prev[type]);

      let minimum = 0;

      if (type === 'adults') {
        minimum = 1;
      }

      const newValue = Math.max(
        minimum,
        Math.min(20, current + amount)
      );

      return {
        ...prev,
        [type]: newValue
      };
    });

    setMessage({
      type: '',
      text: ''
    });
  };

  // =========================
  // ROOM COUNTER
  // =========================

  const changeRooms = (amount) => {
    setFormData((prev) => ({
      ...prev,
      rooms: Math.max(
        1,
        Math.min(10, Number(prev.rooms) + amount)
      )
    }));

    setMessage({
      type: '',
      text: ''
    });
  };

  // =========================
  // NIGHTS
  // =========================

  const nights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) {
      return 0;
    }

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);

    const difference =
      end.getTime() - start.getTime();

    const result =
      Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

    return result > 0 ? result : 0;
  }, [formData.checkIn, formData.checkOut]);

  // =========================
  // TOTAL GUESTS
  // =========================

  const totalGuests =
    Number(formData.adults) +
    Number(formData.children);

  // =========================
  // TOTAL ROOM CAPACITY
  // =========================

  const totalCapacity =
    selectedRoom.capacity *
    Number(formData.rooms);

  // =========================
  // PRICE
  // =========================

  const totalPrice =
    selectedRoom.price *
    Number(formData.rooms) *
    nights;

  // =========================
  // CAPACITY CHECK
  // =========================

  const capacityExceeded =
    totalGuests > totalCapacity;

  // =========================
  // VALIDATION
  // =========================

  const validate = () => {
    if (!formData.name.trim()) {
      return isAm
        ? 'እባክዎ ሙሉ ስምዎን ያስገቡ።'
        : 'Please enter your full name.';
    }

    if (!formData.phone.trim()) {
      return isAm
        ? 'እባክዎ ስልክ ቁጥርዎን ያስገቡ።'
        : 'Please enter your phone number.';
    }

    if (!formData.email.trim()) {
      return isAm
        ? 'እባክዎ Email ያስገቡ።'
        : 'Please enter your email address.';
    }

    if (!formData.checkIn) {
      return isAm
        ? 'እባክዎ Check-in ቀን ይምረጡ።'
        : 'Please select your check-in date.';
    }

    if (!formData.checkOut) {
      return isAm
        ? 'እባክዎ Check-out ቀን ይምረጡ።'
        : 'Please select your check-out date.';
    }

    if (formData.checkOut <= formData.checkIn) {
      return isAm
        ? 'Check-out ቀን ከ Check-in በኋላ መሆን አለበት።'
        : 'Check-out must be after check-in.';
    }

    if (capacityExceeded) {
      return isAm
        ? `የመረጡት ${selectedRoom.am} ${formData.rooms} ክፍል ለ ${totalGuests} ሰዎች አይበቃም። እባክዎ የክፍል ብዛት ይጨምሩ።`
        : `Your selected ${selectedRoom.en} does not have enough capacity for ${totalGuests} guests. Please increase the number of rooms.`;
    }

    if (nights <= 0) {
      return isAm
        ? 'እባክዎ ትክክለኛ የቆይታ ቀን ይምረጡ።'
        : 'Please select valid stay dates.';
    }

    return null;
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const error = validate();

    if (error) {
      setMessage({
        type: 'error',
        text: error
      });

      setLoading(false);
      return;
    }

    try {
      const bookingId =
        `ZADDIS-${Date.now().toString().slice(-8)}`;

      await addDoc(
        collection(db, 'bookings'),
        {
          bookingId,

          guest: {
            name: formData.name.trim(),
            phone: formData.phone.trim(),
            email: formData.email.trim()
          },

          room: {
            type: formData.room,
            roomNameAm: selectedRoom.am,
            roomNameEn: selectedRoom.en,
            pricePerNight: selectedRoom.price,
            capacityPerRoom: selectedRoom.capacity
          },

          stay: {
            checkIn: formData.checkIn,
            checkOut: formData.checkOut,
            nights,
            rooms: Number(formData.rooms)
          },

          guests: {
            adults: Number(formData.adults),
            children: Number(formData.children),
            totalGuests
          },

          pricing: {
            pricePerNight: selectedRoom.price,
            rooms: Number(formData.rooms),
            nights,
            totalPrice
          },

          specialRequest:
            formData.specialRequest.trim(),

          status: 'Pending',

          createdAt:
            new Date().toISOString()
        }
      );

      setMessage({
        type: 'success',
        text: isAm
          ? `ማዘዣዎ በተሳካ ሁኔታ ተልኳል። Booking ID: ${bookingId}`
          : `Your booking has been submitted successfully. Booking ID: ${bookingId}`
      });

      setFormData({
        name: '',
        phone: '',
        email: '',
        room: 'Standard Room',
        checkIn: '',
        checkOut: '',
        adults: 1,
        children: 0,
        rooms: 1,
        specialRequest: ''
      });

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } catch (error) {
      console.error(error);

      setMessage({
        type: 'error',
        text: isAm
          ? 'ማዘዣውን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
          : 'Something went wrong. Please try again.'
      });

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f6f7f9',
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#172033'
      }}
    >

      {/* =================================
          HERO
      ================================= */}

      <section
        style={{
          backgroundImage:
            'linear-gradient(rgba(10,18,35,0.72), rgba(10,18,35,0.88)), url("/g1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '85px 20px',
          color: '#fff',
          textAlign: 'center'
        }}
      >

        <div
          style={{
            maxWidth: '800px',
            margin: 'auto'
          }}
        >

          <div
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              borderRadius: '50px',
              background: 'rgba(243,156,18,0.15)',
              border:
                '1px solid rgba(255,255,255,0.25)',
              marginBottom: '18px',
              fontSize: '0.9rem'
            }}
          >
            ✦ Z ADDIS HOTEL
          </div>

          <h1
            style={{
              fontSize:
                'clamp(2.3rem, 6vw, 4rem)',
              margin: '0 0 15px',
              lineHeight: 1.15
            }}
          >
            {isAm
              ? 'ቆይታዎን ያስይዙ'
              : 'Book Your Stay'}
          </h1>

          <p
            style={{
              maxWidth: '650px',
              margin: 'auto',
              color: '#e5e7eb',
              fontSize: '1.05rem',
              lineHeight: 1.7
            }}
          >
            {isAm
              ? 'የሚመችዎትን ክፍል ይምረጡ እና ቆይታዎን በቀላሉ ያስይዙ።'
              : 'Choose your room and reserve your stay with ease.'}
          </p>

        </div>

      </section>


      {/* =================================
          MESSAGE
      ================================= */}

      {message.text && (
        <div
          style={{
            maxWidth: '1100px',
            margin: '25px auto 0',
            padding: '0 20px'
          }}
        >

          <div
            style={{
              padding: '17px 20px',
              borderRadius: '14px',
              background:
                message.type === 'success'
                  ? '#ecfdf5'
                  : '#fef2f2',
              border:
                message.type === 'success'
                  ? '1px solid #a7f3d0'
                  : '1px solid #fecaca',
              color:
                message.type === 'success'
                  ? '#047857'
                  : '#b91c1c',
              lineHeight: 1.6
            }}
          >
            {message.type === 'success'
              ? '✓ '
              : '⚠️ '}
            {message.text}
          </div>

        </div>
      )}


      {/* =================================
          MAIN
      ================================= */}

      <main
        style={{
          maxWidth: '1150px',
          margin: 'auto',
          padding: '55px 20px 90px'
        }}
      >

        <div
          className="booking-grid"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1.4fr) minmax(300px, 0.6fr)',
            gap: '30px',
            alignItems: 'start'
          }}
        >

          {/* =================================
              FORM
          ================================= */}

          <form
            onSubmit={handleSubmit}
            style={{
              background: '#fff',
              borderRadius: '22px',
              padding:
                'clamp(22px, 4vw, 40px)',
              boxShadow:
                '0 15px 45px rgba(0,0,0,0.07)'
            }}
          >

            {/* GUEST INFORMATION */}

            <SectionTitle
              small={isAm
                ? 'የእንግዳ መረጃ'
                : 'GUEST INFORMATION'}
              title={isAm
                ? 'የእርስዎን መረጃ ያስገቡ'
                : 'Guest Information'}
            />

            <div
              style={{
                display: 'grid',
                gap: '18px'
              }}
            >

              <Input
                label={isAm
                  ? 'ሙሉ ስም'
                  : 'Full Name'}
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={isAm
                  ? 'ሙሉ ስምዎን ያስገቡ'
                  : 'Enter your full name'}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '18px'
                }}
              >

                <Input
                  label={isAm
                    ? 'ስልክ ቁጥር'
                    : 'Phone Number'}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09XXXXXXXX"
                />

                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                />

              </div>

            </div>


            {/* ROOM */}

            <div
              style={{
                marginTop: '45px'
              }}
            >

              <SectionTitle
                small={isAm
                  ? 'የክፍል ምርጫ'
                  : 'ROOM SELECTION'}
                title={isAm
                  ? 'ክፍልዎን ይምረጡ'
                  : 'Choose Your Room'}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(190px, 1fr))',
                  gap: '15px'
                }}
              >

                {Object.entries(rooms).map(
                  ([key, room]) => {

                    const active =
                      formData.room === key;

                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            room: key
                          }))
                        }
                        style={{
                          padding: 0,
                          overflow: 'hidden',
                          borderRadius: '15px',
                          background: '#fff',
                          cursor: 'pointer',
                          textAlign: 'left',
                          border: active
                            ? '3px solid #e67e22'
                            : '1px solid #e5e7eb',
                          boxShadow: active
                            ? '0 8px 25px rgba(230,126,34,0.18)'
                            : 'none'
                        }}
                      >

                        <img
                          src={room.image}
                          alt={room.en}
                          style={{
                            width: '100%',
                            height: '140px',
                            objectFit: 'cover',
                            display: 'block'
                          }}
                        />

                        <div
                          style={{
                            padding: '14px'
                          }}
                        >

                          <strong
                            style={{
                              display: 'block',
                              marginBottom: '6px'
                            }}
                          >
                            {isAm
                              ? room.am
                              : room.en}
                          </strong>

                          <span
                            style={{
                              color: '#e67e22',
                              fontWeight: '800'
                            }}
                          >
                            {formatPrice(room.price)}
                            {' '}ETB
                          </span>

                          <span
                            style={{
                              color: '#777',
                              fontSize: '0.8rem'
                            }}
                          >
                            {' '} / night
                          </span>

                        </div>

                      </button>
                    );
                  }
                )}

              </div>

            </div>


            {/* DATES */}

            <div
              style={{
                marginTop: '45px'
              }}
            >

              <SectionTitle
                small={isAm
                  ? 'የቆይታ ጊዜ'
                  : 'STAY DETAILS'}
                title={isAm
                  ? 'የሚመጡበትን ቀን ይምረጡ'
                  : 'Select Your Dates'}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '18px'
                }}
              >

                <Input
                  label={isAm
                    ? 'የመግቢያ ቀን'
                    : 'Check-In'}
                  name="checkIn"
                  type="date"
                  min={today}
                  value={formData.checkIn}
                  onChange={handleChange}
                />

                <Input
                  label={isAm
                    ? 'የመውጫ ቀን'
                    : 'Check-Out'}
                  name="checkOut"
                  type="date"
                  min={
                    formData.checkIn || today
                  }
                  value={formData.checkOut}
                  onChange={handleChange}
                />

              </div>

              {nights > 0 && (
                <div
                  style={{
                    marginTop: '14px',
                    padding: '13px 16px',
                    borderRadius: '11px',
                    background: '#f8fafc',
                    color: '#475569'
                  }}
                >
                  🌙 <strong>{nights}</strong>{' '}
                  {isAm
                    ? 'ሌሊት'
                    : nights === 1
                    ? 'night'
                    : 'nights'}
                </div>
              )}

            </div>


            {/* GUESTS */}

            <div
              style={{
                marginTop: '45px'
              }}
            >

              <SectionTitle
                small={isAm
                  ? 'እንግዶች'
                  : 'GUESTS'}
                title={isAm
                  ? 'ስንት ሰዎች ይመጣሉ?'
                  : 'How Many Guests?'}
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '15px'
                }}
              >

                <Counter
                  icon="👤"
                  title="Adults"
                  subtitle={isAm
                    ? 'አዋቂዎች'
                    : 'Age 18+'}
                  value={formData.adults}
                  onMinus={() =>
                    changeGuests('adults', -1)
                  }
                  onPlus={() =>
                    changeGuests('adults', 1)
                  }
                />

                <Counter
                  icon="🧒"
                  title="Children"
                  subtitle={isAm
                    ? 'ልጆች'
                    : 'Under 18'}
                  value={formData.children}
                  onMinus={() =>
                    changeGuests('children', -1)
                  }
                  onPlus={() =>
                    changeGuests('children', 1)
                  }
                />

                <Counter
                  icon="🏨"
                  title="Rooms"
                  subtitle={isAm
                    ? 'የክፍል ብዛት'
                    : 'Number of rooms'}
                  value={formData.rooms}
                  onMinus={() =>
                    changeRooms(-1)
                  }
                  onPlus={() =>
                    changeRooms(1)
                  }
                />

              </div>

            </div>


            {/* CAPACITY WARNING */}

            <div
              style={{
                marginTop: '18px',
                padding: '15px',
                borderRadius: '12px',
                background: capacityExceeded
                  ? '#fef2f2'
                  : '#f0fdf4',
                border: capacityExceeded
                  ? '1px solid #fecaca'
                  : '1px solid #bbf7d0',
                color: capacityExceeded
                  ? '#b91c1c'
                  : '#166534'
              }}
            >

              {capacityExceeded
                ? '⚠️'
                : '✓'}

              {' '}

              {capacityExceeded
                ? (
                  isAm
                    ? `${formData.rooms} ${selectedRoom.am} ለ ${totalGuests} ሰዎች አይበቃም። እባክዎ Rooms ይጨምሩ።`
                    : `${formData.rooms} ${selectedRoom.en} is not enough for ${totalGuests} guests. Please increase rooms.`
                )
                : (
                  isAm
                    ? `${formData.rooms} ክፍል ለ ${totalGuests} ሰዎች በቂ ነው።`
                    : `${formData.rooms} room${formData.rooms > 1 ? 's' : ''} is enough for ${totalGuests} guests.`
                )}

            </div>


            {/* SPECIAL REQUEST */}

            <div
              style={{
                marginTop: '40px'
              }}
            >

              <label
                style={{
                  display: 'block',
                  fontWeight: '700',
                  marginBottom: '8px'
                }}
              >
                📝{' '}
                {isAm
                  ? 'ልዩ ጥያቄ'
                  : 'Special Request'}
                <span
                  style={{
                    color: '#999',
                    fontWeight: '400'
                  }}
                >
                  {' '}
                  ({isAm ? 'አማራጭ' : 'Optional'})
                </span>
              </label>

              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleChange}
                rows="4"
                placeholder={isAm
                  ? 'ማንኛውም ልዩ ጥያቄ ካለዎት እዚህ ይጻፉ...'
                  : 'Write any special request here...'}
                style={{
                  ...inputStyle,
                  resize: 'vertical'
                }}
              />

            </div>


            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading || capacityExceeded}
              style={{
                width: '100%',
                marginTop: '30px',
                padding: '17px',
                border: 'none',
                borderRadius: '13px',
                background:
                  loading || capacityExceeded
                    ? '#9ca3af'
                    : '#e67e22',
                color: '#fff',
                fontWeight: '800',
                fontSize: '1.05rem',
                cursor:
                  loading || capacityExceeded
                    ? 'not-allowed'
                    : 'pointer',
                boxShadow:
                  loading || capacityExceeded
                    ? 'none'
                    : '0 10px 25px rgba(230,126,34,0.25)'
              }}
            >

              {loading
                ? '⏳ Submitting...'
                : isAm
                ? '🛎️ ቦታ አስይዝ'
                : '🛎️ Confirm Booking'}

            </button>

          </form>


          {/* =================================
              SUMMARY
          ================================= */}

          <aside
            style={{
              position: 'sticky',
              top: '25px'
            }}
          >

            <div
              style={{
                background: '#fff',
                borderRadius: '22px',
                overflow: 'hidden',
                boxShadow:
                  '0 15px 45px rgba(0,0,0,0.08)'
              }}
            >

              <img
                src={selectedRoom.image}
                alt={selectedRoom.en}
                style={{
                  width: '100%',
                  height: '240px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              <div
                style={{
                  padding: '25px'
                }}
              >

                <small
                  style={{
                    color: '#e67e22',
                    fontWeight: '800',
                    letterSpacing: '1px'
                  }}
                >
                  {isAm
                    ? 'የማዘዣ ማጠቃለያ'
                    : 'YOUR RESERVATION'}
                </small>

                <h2
                  style={{
                    margin: '8px 0 20px'
                  }}
                >
                  {isAm
                    ? selectedRoom.am
                    : selectedRoom.en}
                </h2>

                <SummaryRow
                  label={isAm
                    ? 'የክፍል ዋጋ'
                    : 'Room price'}
                  value={`${formatPrice(
                    selectedRoom.price
                  )} ETB`}
                />

                <SummaryRow
                  label={isAm
                    ? 'ክፍሎች'
                    : 'Rooms'}
                  value={formData.rooms}
                />

                <SummaryRow
                  label={isAm
                    ? 'ሌሊቶች'
                    : 'Nights'}
                  value={nights}
                />

                <SummaryRow
                  label={isAm
                    ? 'Adults'
                    : 'Adults'}
                  value={formData.adults}
                />

                <SummaryRow
                  label={isAm
                    ? 'Children'
                    : 'Children'}
                  value={formData.children}
                />

                <div
                  style={{
                    marginTop: '18px',
                    padding: '20px',
                    background: '#fff7ed',
                    borderRadius: '15px'
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      justifyContent:
                        'space-between',
                      alignItems: 'center',
                      gap: '15px'
                    }}
                  >

                    <strong>
                      {isAm
                        ? 'ጠቅላላ'
                        : 'Total'}
                    </strong>

                    <strong
                      style={{
                        color: '#e67e22',
                        fontSize: '1.4rem'
                      }}
                    >
                      {formatPrice(
                        totalPrice
                      )}{' '}
                      ETB
                    </strong>

                  </div>

                </div>

                <div
                  style={{
                    marginTop: '20px',
                    paddingTop: '18px',
                    borderTop:
                      '1px solid #eee',
                    color: '#6b7280',
                    fontSize: '0.9rem',
                    lineHeight: 1.6
                  }}
                >
                  🔒{' '}
                  {isAm
                    ? 'የእርስዎ የማዘዣ መረጃ በደህና ይቀመጣል።'
                    : 'Your reservation information is securely stored.'}
                </div>

                <Link
                  to="/contact"
                  style={{
                    display: 'block',
                    marginTop: '18px',
                    textAlign: 'center',
                    color: '#e67e22',
                    textDecoration: 'none',
                    fontWeight: '700'
                  }}
                >
                  {isAm
                    ? 'እርዳታ ይፈልጋሉ? →'
                    : 'Need help? →'}
                </Link>

              </div>

            </div>

          </aside>

        </div>

      </main>


      {/* =================================
          RESPONSIVE STYLE
      ================================= */}

      <style>
        {`
          @media (max-width: 850px) {
            .booking-grid {
              grid-template-columns: 1fr !important;
            }

            .booking-grid aside {
              position: static !important;
            }
          }

          input:focus,
          select:focus,
          textarea:focus {
            border-color: #e67e22 !important;
            box-shadow: 0 0 0 3px rgba(230,126,34,0.12);
          }

          button {
            font-family: inherit;
          }

          button:hover:not(:disabled) {
            transform: translateY(-1px);
          }

          input,
          select,
          textarea,
          button {
            transition: all 0.2s ease;
          }
        `}
      </style>

    </div>
  );
};


// =====================================
// COMPONENTS
// =====================================

const SectionTitle = ({ small, title }) => (
  <div
    style={{
      marginBottom: '22px'
    }}
  >

    <div
      style={{
        color: '#e67e22',
        fontWeight: '800',
        fontSize: '0.8rem',
        letterSpacing: '1px'
      }}
    >
      {small}
    </div>

    <h2
      style={{
        margin: '7px 0 0',
        fontSize: '1.65rem',
        color: '#172033'
      }}
    >
      {title}
    </h2>

  </div>
);


const Input = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  min
}) => (
  <div>

    <label
      style={{
        display: 'block',
        marginBottom: '8px',
        fontWeight: '700',
        color: '#374151'
      }}
    >
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      required
      style={inputStyle}
    />

  </div>
);


const Counter = ({
  icon,
  title,
  subtitle,
  value,
  onMinus,
  onPlus
}) => (
  <div
    style={{
      padding: '18px',
      border: '1px solid #e5e7eb',
      borderRadius: '15px',
      background: '#fff'
    }}
  >

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px'
      }}
    >

      <span
        style={{
          fontSize: '1.5rem'
        }}
      >
        {icon}
      </span>

      <div>

        <strong
          style={{
            display: 'block'
          }}
        >
          {title}
        </strong>

        <small
          style={{
            color: '#777'
          }}
        >
          {subtitle}
        </small>

      </div>

    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >

      <button
        type="button"
        onClick={onMinus}
        style={counterButton}
      >
        −
      </button>

      <strong
        style={{
          fontSize: '1.3rem'
        }}
      >
        {value}
      </strong>

      <button
        type="button"
        onClick={onPlus}
        style={counterButton}
      >
        +
      </button>

    </div>

  </div>
);


const SummaryRow = ({ label, value }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '11px 0',
      borderBottom: '1px solid #f0f0f0',
      gap: '15px'
    }}
  >

    <span
      style={{
        color: '#6b7280'
      }}
    >
      {label}
    </span>

    <strong>
      {value}
    </strong>

  </div>
);


// =====================================
// STYLES
// =====================================

const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '13px 14px',
  borderRadius: '11px',
  border: '1px solid #dfe3e8',
  background: '#fff',
  color: '#172033',
  fontSize: '1rem',
  outline: 'none'
};

const counterButton = {
  width: '38px',
  height: '38px',
  borderRadius: '50%',
  border: '1px solid #e5e7eb',
  background: '#f8fafc',
  color: '#172033',
  fontSize: '1.3rem',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

export default Booking;
