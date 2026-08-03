import React, { useMemo, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const Booking = ({ lang }) => {
  const isAm = lang === 'am';

  // =========================
  // ROOM DATA
  // =========================
  const roomDetails = {
    'Standard Room': {
      nameAm: 'Standard Room',
      nameEn: 'Standard Room',
      bedsAm: '1 Queen Size አልጋ',
      bedsEn: '1 Queen Size Bed',
      amenitiesAm: 'ነፃ WiFi፣ ሙቅ ውሃ፣ TV፣ የስራ ጠረጴዛ',
      amenitiesEn: 'Free WiFi, Hot Shower, TV, Work Desk',
      price: 1500,
      image: '/r1.jpg',
      maxAdults: 2,
      maxChildren: 1,
      maxGuests: 3
    },

    'Twin Room': {
      nameAm: 'Twin Room',
      nameEn: 'Twin Room',
      bedsAm: '2 ነጠላ አልጋዎች',
      bedsEn: '2 Twin Size Beds',
      amenitiesAm: 'ነፃ WiFi፣ Balcony፣ ለጓደኞች እና ቤተሰብ ምቹ',
      amenitiesEn: 'Free WiFi, Balcony, Ideal for friends or family',
      price: 2000,
      image: '/r2.jpg',
      maxAdults: 2,
      maxChildren: 2,
      maxGuests: 4
    },

    'Deluxe Room': {
      nameAm: 'Deluxe Room',
      nameEn: 'Deluxe Room',
      bedsAm: '1 King Size አልጋ',
      bedsEn: '1 King Size Bed',
      amenitiesAm: 'Mini Bar፣ City View፣ Jacuzzi፣ Luxury Decor',
      amenitiesEn: 'Mini Bar, City View, Jacuzzi, Luxury Decor',
      price: 3000,
      image: '/r3.jpg',
      maxAdults: 2,
      maxChildren: 2,
      maxGuests: 4
    },

    'Presidential Suite': {
      nameAm: 'Presidential Suite',
      nameEn: 'Presidential Suite',
      bedsAm: 'Master King Bed + ሰፊ ሳሎን',
      bedsEn: 'Master King Bed + Separate Living Room',
      amenitiesAm: 'VIP አገልግሎት፣ Private Balcony፣ Free Breakfast',
      amenitiesEn: 'VIP Service, Private Balcony, Free Breakfast',
      price: 5000,
      image: '/r4.jpg',
      maxAdults: 4,
      maxChildren: 3,
      maxGuests: 7
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

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // =========================
  // SELECTED ROOM
  // =========================
  const selectedRoom = roomDetails[formData.room];

  // =========================
  // TODAY DATE
  // =========================
  const today = new Date().toISOString().split('T')[0];

  // =========================
  // CALCULATE NIGHTS
  // =========================
  const nights = useMemo(() => {
    if (!formData.checkIn || !formData.checkOut) {
      return 0;
    }

    const start = new Date(formData.checkIn);
    const end = new Date(formData.checkOut);

    const difference = end.getTime() - start.getTime();

    const calculatedNights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return calculatedNights > 0 ? calculatedNights : 0;
  }, [formData.checkIn, formData.checkOut]);

  // =========================
  // TOTAL PRICE
  // =========================
  const totalPrice =
    nights *
    selectedRoom.price *
    Number(formData.rooms);

  // =========================
  // TOTAL GUESTS
  // =========================
  const totalGuests =
    Number(formData.adults) +
    Number(formData.children);

  // =========================
  // HANDLE INPUT
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setErrorMessage('');
    setSuccessMessage('');

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // =========================
  // HANDLE ADULTS
  // =========================
  const handleAdultsChange = (e) => {
    const value = Math.max(1, Math.min(20, Number(e.target.value)));

    setFormData((prev) => ({
      ...prev,
      adults: value
    }));

    setErrorMessage('');
  };

  // =========================
  // HANDLE CHILDREN
  // =========================
  const handleChildrenChange = (e) => {
    const value = Math.max(0, Math.min(10, Number(e.target.value)));

    setFormData((prev) => {
      const currentAges = [...prev.childAges];

      if (value > currentAges.length) {
        while (currentAges.length < value) {
          currentAges.push('');
        }
      } else {
        currentAges.length = value;
      }

      return {
        ...prev,
        children: value,
        childAges: currentAges
      };
    });

    setErrorMessage('');
  };

  // =========================
  // HANDLE CHILD AGE
  // =========================
  const handleChildAgeChange = (index, value) => {
    setFormData((prev) => {
      const ages = [...prev.childAges];

      ages[index] = value;

      return {
        ...prev,
        childAges: ages
      };
    });

    setErrorMessage('');
  };

  // =========================
  // FORMAT PRICE
  // =========================
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price);
  };

  // =========================
  // GENERATE BOOKING ID
  // =========================
  const generateBookingId = () => {
    const randomNumber = Math.floor(
      100000 + Math.random() * 900000
    );

    return `ZADDIS-${randomNumber}`;
  };

  // =========================
  // VALIDATE FORM
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

    if (!formData.checkIn) {
      return isAm
        ? 'የCheck-In ቀን ይምረጡ።'
        : 'Please select your check-in date.';
    }

    if (!formData.checkOut) {
      return isAm
        ? 'የCheck-Out ቀን ይምረጡ።'
        : 'Please select your check-out date.';
    }

    if (formData.checkIn < today) {
      return isAm
        ? 'የCheck-In ቀን ያለፈ ቀን መሆን አይችልም።'
        : 'Check-in date cannot be in the past.';
    }

    if (formData.checkOut <= formData.checkIn) {
      return isAm
        ? 'Check-Out ቀን ከCheck-In በኋላ መሆን አለበት።'
        : 'Check-out date must be after check-in date.';
    }

    if (formData.adults < 1) {
      return isAm
        ? 'ቢያንስ 1 Adult መሆን አለበት።'
        : 'There must be at least 1 adult.';
    }

    if (formData.children > 0) {
      for (let i = 0; i < formData.children; i++) {
        if (
          formData.childAges[i] === '' ||
          formData.childAges[i] === undefined
        ) {
          return isAm
            ? `የልጅ ${i + 1} እድሜ ያስገቡ።`
            : `Please enter the age of child ${i + 1}.`;
        }
      }
    }

    if (
      Number(formData.adults) > selectedRoom.maxAdults * Number(formData.rooms)
    ) {
      return isAm
        ? `ይህ ክፍል ቢበዛ ${selectedRoom.maxAdults} Adults ብቻ ይቀበላል።`
        : `This room allows a maximum of ${selectedRoom.maxAdults} adults per room.`;
    }

    if (
      totalGuests >
      selectedRoom.maxGuests * Number(formData.rooms)
    ) {
      return isAm
        ? `ለ${totalGuests} ሰዎች ${formData.rooms} ክፍል በቂ አይደለም።`
        : `${formData.rooms} room(s) cannot accommodate ${totalGuests} guests.`;
    }

    return null;
  };

  // =========================
  // SUBMIT BOOKING
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    const validationError = validateForm();

    if (validationError) {
      setErrorMessage(validationError);
      setLoading(false);
      return;
    }

    const bookingId = generateBookingId();

    try {
      await addDoc(collection(db, 'bookings'), {
        bookingId,

        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim()
        },

        room: {
          type: formData.room,
          pricePerNight: selectedRoom.price,
          rooms: Number(formData.rooms)
        },

        guests: {
          adults: Number(formData.adults),
          children: Number(formData.children),
          childAges: formData.childAges
        },

        stay: {
          checkIn: formData.checkIn,
          checkOut: formData.checkOut,
          nights
        },

        pricing: {
          pricePerNight: selectedRoom.price,
          nights,
          rooms: Number(formData.rooms),
          totalPrice
        },

        specialRequest: formData.specialRequest.trim(),

        status: 'Pending',

        createdAt: new Date().toISOString()
      });

      setSuccessMessage(
        isAm
          ? `ማስያዣዎ በተሳካ ሁኔታ ተልኳል። Booking ID: ${bookingId}`
          : `Your booking has been submitted successfully. Booking ID: ${bookingId}`
      );

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
    } catch (error) {
      console.error('Booking Error:', error);

      setErrorMessage(
        isAm
          ? 'ማስያዣውን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
          : 'Unable to submit your booking. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // INPUT STYLE
  // =========================
  const inputStyle = {
    width: '100%',
    padding: '13px 14px',
    borderRadius: '10px',
    border: '1px solid #ddd',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '7px',
    color: '#34495e',
    fontSize: '14px',
    fontWeight: '600'
  };

  // =========================
  // UI
  // =========================
  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '60px 20px',
        background:
          'linear-gradient(135deg, #fffaf5 0%, #f8f9fa 100%)',
        boxSizing: 'border-box'
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto'
        }}
      >

        {/* HEADER */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: '35px'
          }}
        >
          <div
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              borderRadius: '30px',
              backgroundColor: '#fff0e3',
              color: '#e67e22',
              fontWeight: '700',
              fontSize: '13px',
              marginBottom: '12px'
            }}
          >
            Z ADDIS HOTEL
          </div>

          <h1
            style={{
              margin: '0 0 10px',
              color: '#2c3e50',
              fontSize: 'clamp(30px, 5vw, 46px)'
            }}
          >
            {isAm ? 'ቆይታዎን ያስይዙ' : 'Book Your Stay'}
          </h1>

          <p
            style={{
              margin: 0,
              color: '#777',
              fontSize: '16px'
            }}
          >
            {isAm
              ? 'የሚፈልጉትን ክፍል ይምረጡ እና ማስያዣዎን ያረጋግጡ።'
              : 'Choose your room and complete your reservation.'}
          </p>
        </div>

        {/* SUCCESS MESSAGE */}
        {successMessage && (
          <div
            style={{
              marginBottom: '20px',
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: '#eafaf1',
              color: '#1e8449',
              border: '1px solid #a9dfbf',
              fontWeight: '600'
            }}
          >
            ✅ {successMessage}
          </div>
        )}

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div
            style={{
              marginBottom: '20px',
              padding: '16px',
              borderRadius: '10px',
              backgroundColor: '#fdedec',
              color: '#c0392b',
              border: '1px solid #f5b7b1',
              fontWeight: '600'
            }}
          >
            ⚠️ {errorMessage}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            backgroundColor: '#fff',
            padding: '30px',
            borderRadius: '20px',
            boxShadow: '0 15px 45px rgba(0,0,0,0.08)'
          }}
        >

          {/* ======================================
              LEFT SIDE ROOM PREVIEW
          ====================================== */}
          <div>

            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                borderRadius: '16px',
                marginBottom: '18px'
              }}
            >
              <img
                src={selectedRoom.image}
                alt={selectedRoom.nameEn}
                style={{
                  width: '100%',
                  height: '270px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />

              <div
                style={{
                  position: 'absolute',
                  bottom: '15px',
                  left: '15px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: '#fff',
                  padding: '8px 13px',
                  borderRadius: '8px',
                  fontWeight: '600'
                }}
              >
                {isAm
                  ? selectedRoom.nameAm
                  : selectedRoom.nameEn}
              </div>
            </div>

            <div
              style={{
                backgroundColor: '#fafafa',
                borderRadius: '14px',
                padding: '20px',
                border: '1px solid #eee'
              }}
            >
              <h2
                style={{
                  marginTop: 0,
                  marginBottom: '15px',
                  color: '#2c3e50'
                }}
              >
                {isAm
                  ? selectedRoom.nameAm
                  : selectedRoom.nameEn}
              </h2>

              <p style={{ color: '#555', lineHeight: 1.6 }}>
                🛏️{' '}
                <strong>
                  {isAm ? 'አልጋ:' : 'Beds:'}
                </strong>{' '}
                {isAm
                  ? selectedRoom.bedsAm
                  : selectedRoom.bedsEn}
              </p>

              <p style={{ color: '#555', lineHeight: 1.6 }}>
                ✨{' '}
                <strong>
                  {isAm ? 'ምቾቶች:' : 'Amenities:'}
                </strong>{' '}
                {isAm
                  ? selectedRoom.amenitiesAm
                  : selectedRoom.amenitiesEn}
              </p>

              <p
                style={{
                  color: '#555',
                  lineHeight: 1.6
                }}
              >
                👥{' '}
                <strong>
                  {isAm
                    ? 'የእንግዳ አቅም:'
                    : 'Guest Capacity:'}
                </strong>{' '}
                {selectedRoom.maxGuests}
              </p>

              <div
                style={{
                  marginTop: '18px',
                  paddingTop: '18px',
                  borderTop: '1px solid #ddd'
                }}
              >
                <span
                  style={{
                    color: '#e67e22',
                    fontSize: '25px',
                    fontWeight: '800'
                  }}
                >
                  {formatPrice(selectedRoom.price)}
                </span>

                <span
                  style={{
                    color: '#777',
                    marginLeft: '5px'
                  }}
                >
                  ETB / {isAm ? 'ሌሊት' : 'night'}
                </span>
              </div>
            </div>

            {/* PRICE SUMMARY */}
            <div
              style={{
                marginTop: '20px',
                padding: '20px',
                borderRadius: '14px',
                backgroundColor: '#fff7ed',
                border: '1px solid #f6d7b0'
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  color: '#2c3e50'
                }}
              >
                {isAm ? 'የክፍያ ማጠቃለያ' : 'Price Summary'}
              </h3>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}
              >
                <span>
                  {formatPrice(selectedRoom.price)} ×{' '}
                  {formData.rooms} × {nights}
                </span>

                <strong>
                  {formatPrice(totalPrice)} ETB
                </strong>
              </div>

              <div
                style={{
                  borderTop: '1px solid #e5c9a8',
                  marginTop: '12px',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <strong>
                  {isAm ? 'ጠቅላላ:' : 'Total:'}
                </strong>

                <strong
                  style={{
                    color: '#e67e22',
                    fontSize: '21px'
                  }}
                >
                  {formatPrice(totalPrice)} ETB
                </strong>
              </div>
            </div>
          </div>

          {/* ======================================
              RIGHT SIDE FORM
          ====================================== */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}
          >

            {/* PERSONAL INFORMATION */}
            <div>
              <h3
                style={{
                  margin: '0 0 15px',
                  color: '#2c3e50'
                }}
              >
                {isAm
                  ? 'የእንግዳ መረጃ'
                  : 'Guest Information'}
              </h3>

              <div
                style={{
                  display: 'grid',
                  gap: '14px'
                }}
              >

                <div>
                  <label style={labelStyle}>
                    {isAm ? 'ሙሉ ስም *' : 'Full Name *'}
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
                </div>

                <div>
                  <label style={labelStyle}>
                    {isAm
                      ? 'ስልክ ቁጥር *'
                      : 'Phone Number *'}
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
                    {isAm
                      ? 'Email (አማራጭ)'
                      : 'Email (Optional)'}
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    style={inputStyle}
                  />
                </div>

              </div>
            </div>

            {/* ROOM */}
            <div>
              <label style={labelStyle}>
                {isAm ? 'የክፍል አይነት' : 'Room Type'}
              </label>

              <select
                name="room"
                value={formData.room}
                onChange={handleChange}
                style={{
                  ...inputStyle,
                  cursor: 'pointer'
                }}
              >
                {Object.keys(roomDetails).map((room) => (
                  <option key={room} value={room}>
                    {room} -{' '}
                    {formatPrice(roomDetails[room].price)} ETB
                  </option>
                ))}
              </select>
            </div>

            {/* DATES */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  'repeat(auto-fit, minmax(140px, 1fr))',
                gap: '12px'
              }}
            >

              <div>
                <label style={labelStyle}>
                  {isAm ? 'Check-In *' : 'Check-In *'}
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
                  {isAm ? 'Check-Out *' : 'Check-Out *'}
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
                  padding: '12px 15px',
                  borderRadius: '10px',
                  backgroundColor: '#f5f6f7',
                  color: '#555',
                  fontWeight: '600'
                }}
              >
                🌙 {nights}{' '}
                {isAm
                  ? nights === 1
                    ? 'ሌሊት'
                    : 'ሌሊቶች'
                  : nights === 1
                    ? 'night'
                    : 'nights'}
              </div>
            )}

            {/* GUESTS */}
            <div>
              <h3
                style={{
                  margin: '0 0 14px',
                  color: '#2c3e50'
                }}
              >
                {isAm ? 'እንግዶች' : 'Guests'}
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns:
                    'repeat(auto-fit, minmax(120px, 1fr))',
                  gap: '12px'
                }}
              >

                {/* ADULTS */}
                <div>
                  <label style={labelStyle}>
                    👤 {isAm ? 'Adults' : 'Adults'}
                  </label>

                  <select
                    value={formData.adults}
                    onChange={handleAdultsChange}
                    style={inputStyle}
                  >
                    {[1, 2, 3, 4, 5, 6].map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>

                  <small style={{ color: '#888' }}>
                    {isAm ? '18+ ዓመት' : '18+ years'}
                  </small>
                </div>

                {/* CHILDREN */}
                <div>
                  <label style={labelStyle}>
                    🧒 {isAm ? 'Children' : 'Children'}
                  </label>

                  <select
                    value={formData.children}
                    onChange={handleChildrenChange}
                    style={inputStyle}
                  >
                    {[0, 1, 2, 3, 4, 5].map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>

                  <small style={{ color: '#888' }}>
                    {isAm ? '0-17 ዓመት' : '0-17 years'}
                  </small>
                </div>

                {/* ROOMS */}
                <div>
                  <label style={labelStyle}>
                    🛏️ {isAm ? 'Rooms' : 'Rooms'}
                  </label>

                  <select
                    name="rooms"
                    value={formData.rooms}
                    onChange={handleChange}
                    style={inputStyle}
                  >
                    {[1, 2, 3, 4, 5].map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>

              </div>
            </div>

            {/* CHILD AGES */}
            {formData.children > 0 && (
              <div
                style={{
                  padding: '15px',
                  borderRadius: '12px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #eee'
                }}
              >
                <h4
                  style={{
                    marginTop: 0,
                    color: '#34495e'
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
                    gap: '12px'
                  }}
                >
                  {formData.childAges.map((age, index) => (
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
                        required
                      >
                        <option value="">
                          {isAm
                            ? 'እድሜ ይምረጡ'
                            : 'Select age'}
                        </option>

                        {Array.from(
                          { length: 18 },
                          (_, i) => i
                        ).map((ageNumber) => (
                          <option
                            key={ageNumber}
                            value={ageNumber}
                          >
                            {ageNumber}{' '}
                            {isAm
                              ? 'ዓመት'
                              : 'years'}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SPECIAL REQUEST */}
            <div>
              <label style={labelStyle}>
                {isAm
                  ? 'ልዩ ጥያቄ (አማራጭ)'
                  : 'Special Request (Optional)'}
              </label>

              <textarea
                name="specialRequest"
                value={formData.specialRequest}
                onChange={handleChange}
                rows="4"
                placeholder={
                  isAm
                    ? 'ለምሳሌ፦ Airport pickup እፈልጋለሁ...'
                    : 'Example: I need airport pickup...'
                }
                style={{
                  ...inputStyle,
                  resize: 'vertical'
                }}
              />
            </div>

            {/* TOTAL */}
            <div
              style={{
                padding: '18px',
                borderRadius: '12px',
                backgroundColor: '#2c3e50',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '15px',
                flexWrap: 'wrap'
              }}
            >
              <div>
                <div style={{ opacity: 0.8 }}>
                  {isAm ? 'ጠቅላላ ዋጋ' : 'Total Price'}
                </div>

                <strong style={{ fontSize: '24px' }}>
                  {formatPrice(totalPrice)} ETB
                </strong>
              </div>

              <div style={{ textAlign: 'right' }}>
                <small style={{ opacity: 0.8 }}>
                  {formData.rooms} room × {nights} night
                </small>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '16px',
                backgroundColor: loading
                  ? '#95a5a6'
                  : '#e67e22',
                color: '#fff',
                border: 'none',
                borderRadius: '11px',
                fontSize: '17px',
                cursor: loading
                  ? 'not-allowed'
                  : 'pointer',
                fontWeight: '700',
                boxShadow: loading
                  ? 'none'
                  : '0 7px 20px rgba(230,126,34,0.25)',
                transition: 'all 0.2s ease'
              }}
            >
              {loading
                ? isAm
                  ? '⏳ በመላክ ላይ...'
                  : '⏳ Submitting...'
                : isAm
                  ? '✓ ማስያዣውን አረጋግጥ'
                  : '✓ Confirm Booking'}
            </button>

            <p
              style={{
                margin: 0,
                textAlign: 'center',
                color: '#888',
                fontSize: '12px'
              }}
            >
              🔒{' '}
              {isAm
                ? 'የእርስዎ መረጃ በደህና ይቀመጣል።'
                : 'Your information is securely stored.'}
            </p>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Booking;
