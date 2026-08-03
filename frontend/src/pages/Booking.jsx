import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Booking = ({ lang }) => {

  const isAm = lang === 'am';

  // =========================
  // ROOM DATA
  // =========================

  const roomDetails = {
    'Standard Room': {
      nameAm: 'ስታንዳርድ ክፍል',
      nameEn: 'Standard Room',
      price: 1500,
      capacity: 2,
      bedsAm: '1 Queen Size Bed',
      bedsEn: '1 Queen Size Bed',
      amenitiesAm: 'ነፃ Wi-Fi፣ ሙቅ ውሃ፣ TV፣ የስራ ጠረጴዛ',
      amenitiesEn: 'Free Wi-Fi, Hot Shower, TV, Work Desk',
      image: '/r1.jpg'
    },

    'Twin Room': {
      nameAm: 'ትዊን ክፍል',
      nameEn: 'Twin Room',
      price: 2000,
      capacity: 2,
      bedsAm: '2 Twin Beds',
      bedsEn: '2 Twin Beds',
      amenitiesAm: 'ነፃ Wi-Fi፣ Balcony፣ ለቤተሰብ ምቹ',
      amenitiesEn: 'Free Wi-Fi, Balcony, Ideal for family',
      image: '/r2.jpg'
    },

    'Deluxe Room': {
      nameAm: 'ዴሉክስ ክፍል',
      nameEn: 'Deluxe Room',
      price: 3000,
      capacity: 3,
      bedsAm: '1 King Size Bed',
      bedsEn: '1 King Size Bed',
      amenitiesAm: 'Mini Bar፣ City View፣ Jacuzzi፣ Luxury Decor',
      amenitiesEn: 'Mini Bar, City View, Jacuzzi, Luxury Decor',
      image: '/r3.jpg'
    },

    'Presidential Suite': {
      nameAm: 'ፕሬዝዳንሻል ስዊት',
      nameEn: 'Presidential Suite',
      price: 5000,
      capacity: 4,
      bedsAm: 'Master King Bed + Separate Living Room',
      bedsEn: 'Master King Bed + Separate Living Room',
      amenitiesAm: 'VIP Service፣ Private Balcony፣ Free Breakfast',
      amenitiesEn: 'VIP Service, Private Balcony, Free Breakfast',
      image: '/r4.jpg'
    }
  };

  // =========================
  // FORM STATE
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
    childAges: [],
    rooms: 1,
    specialRequest: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedRoom = roomDetails[formData.room];

  // =========================
  // TODAY'S DATE
  // =========================

  const today = new Date().toISOString().split('T')[0];

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    setErrorMessage('');
    setSuccess(false);
  };

  // =========================
  // CHILDREN CHANGE
  // =========================

  const handleChildrenChange = (e) => {
    const count = Math.max(0, Math.min(6, Number(e.target.value)));

    setFormData((prev) => ({
      ...prev,
      children: count,
      childAges: Array.from(
        { length: count },
        (_, index) => prev.childAges[index] || ''
      )
    }));

    setErrorMessage('');
  };

  // =========================
  // CHILD AGE CHANGE
  // =========================

  const handleChildAgeChange = (index, value) => {
    setFormData((prev) => {
      const updatedAges = [...prev.childAges];
      updatedAges[index] = value;

      return {
        ...prev,
        childAges: updatedAges
      };
    });
  };

  // =========================
  // CHECK NIGHTS
  // =========================

  const nights = useMemo(() => {

    if (!formData.checkIn || !formData.checkOut) {
      return 0;
    }

    const checkInDate = new Date(formData.checkIn);
    const checkOutDate = new Date(formData.checkOut);

    const difference =
      checkOutDate.getTime() - checkInDate.getTime();

    const calculatedNights =
      Math.ceil(difference / (1000 * 60 * 60 * 24));

    return calculatedNights > 0 ? calculatedNights : 0;

  }, [formData.checkIn, formData.checkOut]);

  // =========================
  // TOTAL GUESTS
  // =========================

  const totalGuests =
    Number(formData.adults) + Number(formData.children);

  // =========================
  // TOTAL CAPACITY
  // =========================

  const totalCapacity =
    selectedRoom.capacity * Number(formData.rooms);

  // =========================
  // TOTAL PRICE
  // =========================

  const totalPrice =
    selectedRoom.price *
    Number(formData.rooms) *
    nights;

  // =========================
  // FORMAT PRICE
  // =========================

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  // =========================
  // ROOM CHANGE
  // =========================

  const handleRoomChange = (e) => {

    setFormData((prev) => ({
      ...prev,
      room: e.target.value
    }));

    setErrorMessage('');
    setSuccess(false);
  };

  // =========================
  // RESET FORM
  // =========================

  const resetForm = () => {

    setFormData({
      name: '',
      phone: '',
      email: '',
      room: 'Standard Room',
      checkIn: '',
      checkOut: '',
      adults: 1,
      children: 0,
      childAges: [],
      rooms: 1,
      specialRequest: ''
    });

  };

  // =========================
  // BOOKING ID
  // =========================

  const generateBookingId = () => {

    const randomNumber =
      Math.floor(100000 + Math.random() * 900000);

    return `ZADDIS-${randomNumber}`;
  };

  // =========================
  // FORM VALIDATION
  // =========================

  const validateForm = () => {

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

    if (formData.phone.trim().length < 7) {
      return isAm
        ? 'እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ።'
        : 'Please enter a valid phone number.';
    }

    if (!formData.email.trim()) {
      return isAm
        ? 'እባክዎ Email ያስገቡ።'
        : 'Please enter your email address.';
    }

    if (!formData.checkIn || !formData.checkOut) {
      return isAm
        ? 'እባክዎ Check-in እና Check-out ቀን ይምረጡ።'
        : 'Please select check-in and check-out dates.';
    }

    if (formData.checkOut <= formData.checkIn) {
      return isAm
        ? 'Check-out ቀን ከ Check-in ቀን በኋላ መሆን አለበት።'
        : 'Check-out must be after check-in.';
    }

    if (Number(formData.adults) < 1) {
      return isAm
        ? 'ቢያንስ 1 Adult መሆን አለበት።'
        : 'At least 1 adult is required.';
    }

    if (totalGuests > totalCapacity) {
      return isAm
        ? `${selectedRoom.nameAm} በአንድ ክፍል ${selectedRoom.capacity} ሰው ብቻ ይቀበላል። ተጨማሪ ክፍል ይምረጡ።`
        : `${selectedRoom.nameEn} accommodates ${selectedRoom.capacity} guests per room. Please select more rooms.`;
    }

    if (Number(formData.children) > 0) {

      for (let i = 0; i < formData.childAges.length; i++) {

        const age = formData.childAges[i];

        if (age === '') {
          return isAm
            ? `የልጅ ${i + 1} እድሜ ያስገቡ።`
            : `Please enter the age of child ${i + 1}.`;
        }

        if (Number(age) < 0 || Number(age) > 17) {
          return isAm
            ? 'የልጅ እድሜ ከ 0 እስከ 17 መሆን አለበት።'
            : 'Child age must be between 0 and 17.';
        }
      }

    }

    if (nights <= 0) {
      return isAm
        ? 'እባክዎ ትክክለኛ የቆይታ ቀን ይምረጡ።'
        : 'Please select valid stay dates.';
    }

    return null;
  };

  // =========================
  // SUBMIT BOOKING
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMessage('');

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      return;
    }

    try {

      const bookingId = generateBookingId();

      await addDoc(collection(db, 'bookings'), {

        bookingId,

        guest: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim()
        },

        room: {
          type: formData.room,
          pricePerNight: selectedRoom.price,
          capacity: selectedRoom.capacity
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
          childAges: formData.childAges.map(Number)
        },

        specialRequest:
          formData.specialRequest.trim(),

        pricing: {
          pricePerNight: selectedRoom.price,
          rooms: Number(formData.rooms),
          nights,
          totalPrice
        },

        status: 'Pending',

        createdAt: new Date().toISOString()

      });

      setSuccess(true);

      resetForm();

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    } catch (error) {

      console.error('Booking error:', error);

      setErrorMessage(
        isAm
          ? 'ማዘዣውን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
          : 'Unable to submit your booking. Please try again.'
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================
  // PREVENT INVALID CHECKOUT
  // =========================

  useEffect(() => {

    if (
      formData.checkIn &&
      formData.checkOut &&
      formData.checkOut <= formData.checkIn
    ) {

      setFormData((prev) => ({
        ...prev,
        checkOut: ''
      }));

    }

  }, [formData.checkIn]);

  return (

    <div
      style={{
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        backgroundColor: '#f7f8fa',
        minHeight: '100vh',
        color: '#172033'
      }}
    >

      {/* =====================================
          HERO HEADER
      ====================================== */}

      <section
        style={{
          backgroundImage:
            'linear-gradient(rgba(8,15,30,0.78), rgba(8,15,30,0.78)), url("/g1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '90px 20px',
          textAlign: 'center',
          color: '#fff'
        }}
      >

        <div
          style={{
            maxWidth: '850px',
            margin: '0 auto'
          }}
        >

          <div
            style={{
              display: 'inline-block',
              padding: '8px 18px',
              borderRadius: '30px',
              backgroundColor: 'rgba(230,126,34,0.18)',
              border: '1px solid rgba(255,255,255,0.3)',
              marginBottom: '20px'
            }}
          >
            🛎️ Z ADDIS HOTEL
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.3rem, 6vw, 4rem)',
              margin: '0 0 18px',
              lineHeight: '1.15'
            }}
          >
            {isAm
              ? 'ቆይታዎን አሁኑኑ ያስይዙ'
              : 'Book Your Stay'}
          </h1>

          <p
            style={{
              maxWidth: '650px',
              margin: '0 auto',
              lineHeight: '1.8',
              color: '#e5e7eb',
              fontSize: '1.05rem'
            }}
          >
            {isAm
              ? 'ምቹ ክፍልዎን ይምረጡ፣ የቆይታ ቀንዎን ያስገቡ እና በቀላሉ ቦታዎን ያስይዙ።'
              : 'Choose your room, select your dates and reserve your stay in just a few simple steps.'}
          </p>

        </div>

      </section>


      {/* =====================================
          SUCCESS MESSAGE
      ====================================== */}

      {success && (

        <div
          style={{
            maxWidth: '1000px',
            margin: '30px auto 0',
            padding: '0 20px',
            boxSizing: 'border-box'
          }}
        >

          <div
            style={{
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '20px',
              borderRadius: '15px',
              textAlign: 'center'
            }}
          >

            <div
              style={{
                fontSize: '2rem',
                marginBottom: '8px'
              }}
            >
              ✅
            </div>

            <strong
              style={{
                fontSize: '1.15rem'
              }}
            >
              {isAm
                ? 'ማዘዣዎ በተሳካ ሁኔታ ተልኳል!'
                : 'Your booking has been submitted successfully!'}
            </strong>

            <p
              style={{
                margin: '8px 0 0'
              }}
            >
              {isAm
                ? 'ሆቴሉ ማዘዣዎን ካረጋገጠ በኋላ ያሳውቅዎታል።'
                : 'The hotel will contact you after reviewing your booking.'}
            </p>

          </div>

        </div>

      )}


      {/* =====================================
          MAIN BOOKING AREA
      ====================================== */}

      <section
        style={{
          maxWidth: '1150px',
          margin: '0 auto',
          padding: '60px 20px 100px'
        }}
      >

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1.35fr) minmax(320px, 0.65fr)',
            gap: '30px',
            alignItems: 'start'
          }}
        >

          {/* =================================
              LEFT SIDE FORM
          ================================= */}

          <form
            onSubmit={handleSubmit}
            style={{
              backgroundColor: '#fff',
              padding: 'clamp(22px, 4vw, 40px)',
              borderRadius: '22px',
              boxShadow: '0 15px 45px rgba(0,0,0,0.08)'
            }}
          >

            {/* SECTION TITLE */}

            <div
              style={{
                marginBottom: '30px'
              }}
            >

              <span
                style={{
                  color: '#e67e22',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}
              >
                {isAm ? 'የእንግዳ መረጃ' : 'GUEST INFORMATION'}
              </span>

              <h2
                style={{
                  margin: '8px 0 0',
                  fontSize: '1.9rem',
                  color: '#172033'
                }}
              >
                {isAm
                  ? 'የእርስዎን መረጃ ያስገቡ'
                  : 'Tell Us About Yourself'}
              </h2>

            </div>


            {/* NAME */}

            <label style={labelStyle}>
              {isAm ? 'ሙሉ ስም' : 'Full Name'}
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={
                isAm
                  ? 'ሙሉ ስምዎን ያስገቡ'
                  : 'Enter your full name'
              }
              required
              style={inputStyle}
            />


            {/* PHONE + EMAIL */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '18px',
                marginTop: '20px'
              }}
            >

              <div>

                <label style={labelStyle}>
                  {isAm ? 'ስልክ ቁጥር' : 'Phone Number'}
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="09XXXXXXXX"
                  required
                  style={inputStyle}
                />

              </div>


              <div>

                <label style={labelStyle}>
                  {isAm ? 'Email' : 'Email Address'}
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                  style={inputStyle}
                />

              </div>

            </div>


            {/* ROOM SECTION */}

            <div
              style={{
                marginTop: '40px',
                marginBottom: '25px'
              }}
            >

              <span
                style={{
                  color: '#e67e22',
                  fontWeight: '700',
                  letterSpacing: '1px'
                }}
              >
                {isAm ? 'የክፍል ምርጫ' : 'ROOM SELECTION'}
              </span>

              <h2
                style={{
                  margin: '8px 0 0',
                  fontSize: '1.9rem'
                }}
              >
                {isAm
                  ? 'የሚመችዎትን ክፍል ይምረጡ'
                  : 'Choose Your Room'}
              </h2>

            </div>


            {/* ROOM CARDS */}

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(190px, 1fr))',
                gap: '15px'
              }}
            >

              {Object.entries(roomDetails).map(
                ([roomKey, room]) => {

                  const selected =
                    formData.room === roomKey;

                  return (

                    <button
                      type="button"
                      key={roomKey}
                      onClick={() =>
                        handleRoomChange({
                          target: {
                            value: roomKey
                          }
                        })
                      }
                      style={{
                        padding: 0,
                        border: selected
                          ? '3px solid #e67e22'
                          : '1px solid #e5e7eb',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        textAlign: 'left',
                        boxShadow: selected
                          ? '0 8px 25px rgba(230,126,34,0.18)'
                          : 'none'
                      }}
                    >

                      <img
                        src={room.image}
                        alt={room.nameEn}
                        style={{
                          width: '100%',
                          height: '135px',
                          objectFit: 'cover',
                          display: 'block'
                        }}
                      />

                      <div
                        style={{
                          padding: '15px'
                        }}
                      >

                        <strong
                          style={{
                            display: 'block',
                            color: '#172033',
                            marginBottom: '7px'
                          }}
                        >
                          {isAm
                            ? room.nameAm
                            : room.nameEn}
                        </strong>

                        <span
                          style={{
                            color: '#e67e22',
                            fontWeight: '800'
                          }}
                        >
                          {formatPrice(room.price)} ETB
                          <small
                            style={{
                              color: '#777',
                              fontWeight: '400'
                            }}
                          >
                            {' '}
                            / night
                          </small>
                        </span>

                      </div>

                    </button>

                  );

                }
              )}

            </div>


            {/* SELECTED ROOM INFO */}

            <div
              style={{
                marginTop: '20px',
                padding: '20px',
                borderRadius: '15px',
                backgroundColor: '#fff7ed',
                border: '1px solid #fed7aa'
              }}
            >

              <div
                style={{
                  display: 'flex',
                  gap: '15px',
                  alignItems: 'center',
                  flexWrap: 'wrap'
                }}
              >

                <img
                  src={selectedRoom.image}
                  alt={selectedRoom.nameEn}
                  style={{
                    width: '100px',
                    height: '75px',
                    objectFit: 'cover',
                    borderRadius: '10px'
                  }}
                />

                <div>

                  <h3
                    style={{
                      margin: '0 0 6px'
                    }}
                  >
                    {isAm
                      ? selectedRoom.nameAm
                      : selectedRoom.nameEn}
                  </h3>

                  <p
                    style={{
                      margin: '4px 0',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}
                  >
                    🛏️{' '}
                    {isAm
                      ? selectedRoom.bedsAm
                      : selectedRoom.bedsEn}
                  </p>

                  <p
                    style={{
                      margin: '4px 0',
                      color: '#666',
                      fontSize: '0.9rem'
                    }}
                  >
                    ✨{' '}
                    {isAm
                      ? selectedRoom.amenitiesAm
                      : selectedRoom.amenitiesEn}
                  </p>

                </div>

              </div>

            </div>


            {/* DATES */}

            <div
              style={{
                marginTop: '40px',
                marginBottom: '25px'
              }}
            >

              <span
                style={{
                  color: '#e67e22',
                  fontWeight: '700'
                }}
              >
                {isAm ? 'የቆይታ ጊዜ' : 'STAY DETAILS'}
              </span>

              <h2
                style={{
                  margin: '8px 0 0',
                  fontSize: '1.9rem'
                }}
              >
                {isAm
                  ? 'መቼ ይመጣሉ?'
                  : 'When Are You Staying?'}
              </h2>

            </div>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '18px'
              }}
            >

              <div>

                <label style={labelStyle}>
                  {isAm ? 'የመግቢያ ቀን' : 'Check-In'}
                </label>

                <input
                  type="date"
                  name="checkIn"
                  min={today}
                  value={formData.checkIn}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />

              </div>


              <div>

                <label style={labelStyle}>
                  {isAm ? 'የመውጫ ቀን' : 'Check-Out'}
                </label>

                <input
                  type="date"
                  name="checkOut"
                  min={formData.checkIn || today}
                  value={formData.checkOut}
                  onChange={handleChange}
                  required
                  style={inputStyle}
                />

              </div>

            </div>


            {/* NIGHTS */}

            {nights > 0 && (

              <div
                style={{
                  marginTop: '15px',
                  padding: '12px 16px',
                  backgroundColor: '#f3f4f6',
                  borderRadius: '10px',
                  color: '#4b5563'
                }}
              >
                🌙{' '}
                <strong>
                  {nights}{' '}
                  {isAm
                    ? 'ሌሊት ቆይታ'
                    : nights === 1
                    ? 'night'
                    : 'nights'}
                </strong>
              </div>

            )}


            {/* GUESTS */}

            <div
              style={{
                marginTop: '40px',
                marginBottom: '25px'
              }}
            >

              <span
                style={{
                  color: '#e67e22',
                  fontWeight: '700'
                }}
              >
                {isAm ? 'እንግዶች' : 'GUESTS'}
              </span>

              <h2
                style={{
                  margin: '8px 0 0',
                  fontSize: '1.9rem'
                }}
              >
                {isAm
                  ? 'ስንት ሰዎች ይመጣሉ?'
                  : 'Who Is Staying?'}
              </h2>

            </div>


            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '15px'
              }}
            >

              <div>

                <label style={labelStyle}>
                  👤 {isAm ? 'Adults' : 'Adults'}
                </label>

                <select
                  name="adults"
                  value={formData.adults}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(
                    (number) => (
                      <option
                        key={number}
                        value={number}
                      >
                        {number}
                      </option>
                    )
                  )}
                </select>

                <small
                  style={{
                    color: '#777'
                  }}
                >
                  {isAm ? '18+ ዓመት' : 'Age 18+'}
                </small>

              </div>


              <div>

                <label style={labelStyle}>
                  🧒 {isAm ? 'Children' : 'Children'}
                </label>

                <select
                  name="children"
                  value={formData.children}
                  onChange={handleChildrenChange}
                  style={inputStyle}
                >
                  {[0, 1, 2, 3, 4, 5, 6].map(
                    (number) => (
                      <option
                        key={number}
                        value={number}
                      >
                        {number}
                      </option>
                    )
                  )}
                </select>

                <small
                  style={{
                    color: '#777'
                  }}
                >
                  {isAm ? '0-17 ዓመት' : 'Age 0-17'}
                </small>

              </div>


              <div>

                <label style={labelStyle}>
                  🏨 {isAm ? 'Rooms' : 'Rooms'}
                </label>

                <select
                  name="rooms"
                  value={formData.rooms}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  {[1, 2, 3, 4, 5].map(
                    (number) => (
                      <option
                        key={number}
                        value={number}
                      >
                        {number}
                      </option>
                    )
                  )}
                </select>

                <small
                  style={{
                    color: '#777'
                  }}
                >
                  {isAm
                    ? 'የክፍል ብዛት'
                    : 'Number of rooms'}
                </small>

              </div>

            </div>


            {/* CHILD AGES */}

            {Number(formData.children) > 0 && (

              <div
                style={{
                  marginTop: '20px',
                  padding: '20px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '15px',
                  border: '1px solid #e5e7eb'
                }}
              >

                <h4
                  style={{
                    marginTop: 0,
                    marginBottom: '15px'
                  }}
                >
                  🧒{' '}
                  {isAm
                    ? 'የልጆች እድሜ'
                    : 'Children Ages'}
                </h4>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns:
                      'repeat(auto-fit, minmax(120px, 1fr))',
                    gap: '15px'
                  }}
                >

                  {formData.childAges.map(
                    (age, index) => (

                      <div key={index}>

                        <label style={labelStyle}>
                          {isAm
                            ? `ልጅ ${index + 1}`
                            : `Child ${index + 1}`}
                        </label>

                        <select
                          value={age}
                          onChange={(e) =>
                            handleChildAgeChange(
                              index,
                              e.target.value
                            )
                          }
                          style={inputStyle}
                        >

                          <option value="">
                            {isAm
                              ? 'እድሜ'
                              : 'Age'}
                          </option>

                          {Array.from(
                            { length: 18 },
                            (_, ageNumber) => (
                              <option
                                key={ageNumber}
                                value={ageNumber}
                              >
                                {ageNumber}{' '}
                                {isAm
                                  ? 'ዓመት'
                                  : ageNumber === 1
                                  ? 'year'
                                  : 'years'}
                              </option>
                            )
                          )}

                        </select>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}


            {/* SPECIAL REQUEST */}

            <div
              style={{
                marginTop: '40px'
              }}
            >

              <label style={labelStyle}>
                📝{' '}
                {isAm
                  ? 'ልዩ ጥያቄ (ካለ)'
                  : 'Special Request (Optional)'}
              </label>

              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleChange}
                placeholder={
                  isAm
                    ? 'ለምሳሌ፦ Airport pickup እፈልጋለሁ...'
                    : 'For example: I need airport pickup...'
                }
                rows="5"
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '120px'
                }}
              />

            </div>


            {/* ERROR */}

            {errorMessage && (

              <div
                style={{
                  marginTop: '25px',
                  padding: '15px',
                  borderRadius: '12px',
                  backgroundColor: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  lineHeight: '1.5'
                }}
              >
                ⚠️ {errorMessage}
              </div>

            )}


            {/* SUBMIT BUTTON */}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                marginTop: '30px',
                padding: '17px',
                border: 'none',
                borderRadius: '13px',
                backgroundColor:
                  loading
                    ? '#9ca3af'
                    : '#e67e22',
                color: '#fff',
                fontWeight: '800',
                fontSize: '1.08rem',
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
                boxShadow:
                  loading
                    ? 'none'
                    : '0 10px 25px rgba(230,126,34,0.25)'
              }}
            >
              {loading
                ? `⏳ ${
                    isAm
                      ? 'በመላክ ላይ...'
                      : 'Submitting...'
                  }`
                : `🛎️ ${
                    isAm
                      ? 'ቦታ ያስይዙ'
                      : 'Confirm Booking'
                  }`}
            </button>

          </form>


          {/* =================================
              RIGHT SIDE SUMMARY
          ================================= */}

          <aside
            style={{
              position: 'sticky',
              top: '25px'
            }}
          >

            <div
              style={{
                backgroundColor: '#fff',
                borderRadius: '22px',
                overflow: 'hidden',
                boxShadow: '0 15px 45px rgba(0,0,0,0.08)'
              }}
            >

              {/* ROOM IMAGE */}

              <img
                src={selectedRoom.image}
                alt={selectedRoom.nameEn}
                style={{
                  width: '100%',
                  height: '230px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />


              <div style={{ padding: '25px' }}>

                <span
                  style={{
                    color: '#e67e22',
                    fontWeight: '700',
                    fontSize: '0.85rem',
                    letterSpacing: '1px'
                  }}
                >
                  {isAm
                    ? 'የማዘዣ ማጠቃለያ'
                    : 'BOOKING SUMMARY'}
                </span>

                <h2
                  style={{
                    margin: '8px 0 20px',
                    fontSize: '1.7rem'
                  }}
                >
                  {isAm
                    ? selectedRoom.nameAm
                    : selectedRoom.nameEn}
                </h2>


                {/* PRICE */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #eee'
                  }}
                >

                  <span>
                    {isAm
                      ? 'ዋጋ / ሌሊት'
                      : 'Price / night'}
                  </span>

                  <strong>
                    {formatPrice(selectedRoom.price)} ETB
                  </strong>

                </div>


                {/* NIGHTS */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #eee'
                  }}
                >

                  <span>
                    {isAm
                      ? 'የቆይታ ሌሊት'
                      : 'Number of nights'}
                  </span>

                  <strong>
                    {nights || 0}
                  </strong>

                </div>


                {/* ROOMS */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #eee'
                  }}
                >

                  <span>
                    {isAm
                      ? 'ክፍሎች'
                      : 'Rooms'}
                  </span>

                  <strong>
                    {formData.rooms}
                  </strong>

                </div>


                {/* GUESTS */}

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #eee'
                  }}
                >

                  <span>
                    {isAm
                      ? 'እንግዶች'
                      : 'Guests'}
                  </span>

                  <strong>
                    {formData.adults}{' '}
                    {isAm
                      ? 'Adults'
                      : 'Adults'}
                    {Number(formData.children) > 0 &&
                      ` + ${formData.children} ${
                        isAm
                          ? 'Children'
                          : 'Children'
                      }`}
                  </strong>

                </div>


                {/* TOTAL */}

                <div
                  style={{
                    marginTop: '20px',
                    padding: '20px',
                    borderRadius: '15px',
                    backgroundColor: '#fff7ed'
                  }}
                >

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '15px'
                    }}
                  >

                    <span
                      style={{
                        fontWeight: '700'
                      }}
                    >
                      {isAm
                        ? 'ጠቅላላ ዋጋ'
                        : 'Total Price'}
                    </span>

                    <strong
                      style={{
                        color: '#e67e22',
                        fontSize: '1.45rem'
                      }}
                    >
                      {formatPrice(totalPrice)} ETB
                    </strong>

                  </div>

                </div>


                {/* CAPACITY */}

                <div
                  style={{
                    marginTop: '18px',
                    padding: '14px',
                    borderRadius: '12px',
                    backgroundColor:
                      totalGuests > totalCapacity
                        ? '#fef2f2'
                        : '#f0fdf4',
                    color:
                      totalGuests > totalCapacity
                        ? '#b91c1c'
                        : '#166534',
                    fontSize: '0.9rem'
                  }}
                >

                  {totalGuests > totalCapacity
                    ? '⚠️'
                    : '✓'}{' '}

                  {isAm
                    ? `የክፍል አቅም፡ ${totalCapacity} ሰዎች`
                    : `Room capacity: ${totalCapacity} guests`}

                </div>


                {/* CONTACT */}

                <div
                  style={{
                    marginTop: '25px',
                    paddingTop: '20px',
                    borderTop: '1px solid #eee'
                  }}
                >

                  <p
                    style={{
                      color: '#6b7280',
                      fontSize: '0.9rem',
                      lineHeight: '1.6',
                      margin: 0
                    }}
                  >
                    💬{' '}
                    {isAm
                      ? 'ለተጨማሪ መረጃ እባክዎ ያግኙን።'
                      : 'Need help with your reservation? Contact us anytime.'}
                  </p>

                  <Link
                    to="/contact"
                    style={{
                      display: 'inline-block',
                      marginTop: '12px',
                      color: '#e67e22',
                      textDecoration: 'none',
                      fontWeight: '700'
                    }}
                  >
                    {isAm
                      ? 'Contact Us →'
                      : 'Contact Us →'}
                  </Link>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </section>

    </div>
  );
};


// =====================================
// SHARED STYLES
// =====================================

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  color: '#374151',
  fontWeight: '600',
  fontSize: '0.92rem'
};

const inputStyle = {
  width: '100%',
  padding: '13px 14px',
  borderRadius: '11px',
  border: '1px solid #dfe3e8',
  backgroundColor: '#fff',
  color: '#172033',
  fontSize: '1rem',
  outline: 'none',
  boxSizing: 'border-box'
};

export default Booking;
