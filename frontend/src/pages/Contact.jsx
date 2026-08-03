import React, { useState } from 'react';
import { db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';

const Contact = ({ lang }) => {
  const isAm = lang === 'am';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    setSent(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() ||
        !formData.phone.trim() ||
        !formData.email.trim() ||
        !formData.message.trim()) {
      alert(
        isAm
          ? 'እባክዎ ሁሉንም ቦታዎች ይሙሉ።'
          : 'Please fill in all fields.'
      );
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, 'messages'), {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),

        status: 'unread',

        createdAt: serverTimestamp()
      });

      setSent(true);

      setFormData({
        name: '',
        phone: '',
        email: '',
        message: ''
      });

    } catch (error) {
      console.error('Message error:', error);

      alert(
        isAm
          ? 'መልዕክቱን መላክ አልተቻለም። እባክዎ እንደገና ይሞክሩ።'
          : 'Unable to send your message. Please try again.'
      );
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f7f8fa',
        fontFamily:
          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#172033'
      }}
    >

      {/* HERO */}

      <section
        style={{
          minHeight: '52vh',
          backgroundImage:
            'linear-gradient(rgba(8,18,35,0.68), rgba(8,18,35,0.88)), url("/g1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#fff',
          padding: '80px 20px'
        }}
      >
        <div style={{ maxWidth: '850px' }}>

          <div
            style={{
              display: 'inline-block',
              padding: '9px 20px',
              borderRadius: '50px',
              background: 'rgba(230,126,34,0.18)',
              border: '1px solid rgba(255,255,255,0.25)',
              marginBottom: '22px',
              fontSize: '0.9rem',
              fontWeight: '700'
            }}
          >
            ✦ Z ADDIS HOTEL
          </div>

          <h1
            style={{
              margin: '0 0 20px',
              fontSize: 'clamp(2.4rem, 7vw, 4.5rem)',
              lineHeight: 1.12,
              fontWeight: '800'
            }}
          >
            {isAm
              ? 'ከእኛ ጋር ይገናኙ'
              : 'Get In Touch'}
          </h1>

          <p
            style={{
              maxWidth: '700px',
              margin: 'auto',
              color: '#e5e7eb',
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              lineHeight: 1.8
            }}
          >
            {isAm
              ? 'ጥያቄ ካለዎት፣ ቦታ ማስያዝ ከፈለጉ ወይም ስለ አገልግሎቶቻችን መረጃ ከፈለጉ ያነጋግሩን።'
              : 'Have a question, need help with a booking, or want to learn more about our services? We are here to help.'}
          </p>

        </div>
      </section>


      {/* QUICK INFO */}

      <section
        style={{
          maxWidth: '1200px',
          margin: '-55px auto 0',
          padding: '0 20px',
          position: 'relative'
        }}
      >

        <div
          className="contact-info-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '20px'
          }}
        >

          <InfoCard
            icon="📍"
            title={isAm ? 'አድራሻ' : 'Location'}
            value="Addis Ababa, Ethiopia"
          />

          <InfoCard
            icon="📞"
            title={isAm ? 'ስልክ / WhatsApp' : 'Phone / WhatsApp'}
            value="+251 906 90 90 91"
          />

          <InfoCard
            icon="✉️"
            title="Email"
            value="info@zaddishotel.com"
          />

        </div>
      </section>


      {/* MAIN */}

      <main
        style={{
          maxWidth: '1200px',
          margin: 'auto',
          padding: '75px 20px 90px'
        }}
      >

        <div
          className="contact-main-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '35px'
          }}
        >

          {/* FORM */}

          <div
            style={{
              background: '#fff',
              borderRadius: '22px',
              padding: 'clamp(25px, 5vw, 45px)',
              boxShadow: '0 15px 45px rgba(0,0,0,0.07)'
            }}
          >

            <span
              style={{
                color: '#e67e22',
                fontWeight: '800',
                fontSize: '0.8rem'
              }}
            >
              {isAm ? 'መልዕክት ይላኩ' : 'SEND US A MESSAGE'}
            </span>

            <h2
              style={{
                fontSize: '2rem',
                margin: '10px 0'
              }}
            >
              {isAm
                ? 'እንዴት ልንረዳዎት እንችላለን?'
                : 'How Can We Help You?'}
            </h2>

            <p
              style={{
                color: '#6b7280',
                lineHeight: 1.7,
                marginBottom: '28px'
              }}
            >
              {isAm
                ? 'መልዕክትዎን ይላኩልን። በተቻለ ፍጥነት እንመልስልዎታለን።'
                : 'Send us a message and our team will get back to you as soon as possible.'}
            </p>


            {/* SUCCESS */}

            {sent && (
              <div
                style={{
                  padding: '15px',
                  background: '#ecfdf5',
                  color: '#047857',
                  border: '1px solid #a7f3d0',
                  borderRadius: '12px',
                  marginBottom: '20px'
                }}
              >
                ✓{' '}
                {isAm
                  ? 'መልዕክትዎ በተሳካ ሁኔታ ተልኳል!'
                  : 'Your message has been sent successfully!'}
              </div>
            )}


            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px'
              }}
            >

              <div>
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
              </div>


              <div
                className="form-two-columns"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '18px'
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
                    Email
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


              <div>
                <label style={labelStyle}>
                  {isAm ? 'መልዕክትዎ' : 'Your Message'}
                </label>

                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="7"
                  placeholder={
                    isAm
                      ? 'መልዕክትዎን እዚህ ይጻፉ...'
                      : 'Write your message here...'
                  }
                  required
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    minHeight: '160px'
                  }}
                />
              </div>


              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '16px',
                  background: loading
                    ? '#9ca3af'
                    : 'linear-gradient(135deg,#e67e22,#f39c12)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '1.05rem',
                  fontWeight: '800',
                  cursor: loading
                    ? 'not-allowed'
                    : 'pointer'
                }}
              >
                {loading
                  ? (
                    isAm
                      ? 'በመላክ ላይ...'
                      : 'Sending...'
                  )
                  : (
                    isAm
                      ? '✈️ መልዕክት ላክ'
                      : '✈️ Send Message'
                  )}
              </button>

            </form>
          </div>


          {/* RIGHT SIDE */}

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '25px'
            }}
          >

            <div
              style={{
                background:
                  'linear-gradient(135deg,#172033,#0b1220)',
                color: '#fff',
                borderRadius: '22px',
                padding: '40px',
                boxShadow:
                  '0 15px 45px rgba(0,0,0,0.12)'
              }}
            >

              <span
                style={{
                  color: '#f39c12',
                  fontWeight: '800'
                }}
              >
                Z ADDIS HOTEL
              </span>

              <h2
                style={{
                  fontSize: '2rem',
                  margin: '10px 0 15px'
                }}
              >
                {isAm
                  ? 'ሁልጊዜ እንገኛለን'
                  : 'We Are Here For You'}
              </h2>

              <p
                style={{
                  color: '#cbd5e1',
                  lineHeight: 1.8
                }}
              >
                {isAm
                  ? 'ስለ ክፍሎች፣ ማዘዣዎች፣ አገልግሎቶች ወይም ሌላ ጥያቄ ካለዎት ያነጋግሩን።'
                  : 'Whether you have questions about rooms, reservations, or our services, feel free to contact us anytime.'}
              </p>


              <div style={{ marginTop: '30px' }}>

                <ContactRow
                  icon="📍"
                  title={isAm ? 'አድራሻ' : 'Address'}
                  value="Addis Ababa, Ethiopia"
                />

                <ContactRow
                  icon="📞"
                  title={isAm ? 'ስልክ' : 'Phone'}
                  value="+251 906 90 90 91"
                />

                <ContactRow
                  icon="💬"
                  title="WhatsApp"
                  value="+251 906 90 90 91"
                />

              </div>

            </div>


            {/* GOOGLE MAP */}

            <div
              style={{
                background: '#fff',
                borderRadius: '22px',
                overflow: 'hidden',
                boxShadow:
                  '0 15px 45px rgba(0,0,0,0.08)'
              }}
            >

              <div style={{ padding: '25px' }}>

                <span
                  style={{
                    color: '#e67e22',
                    fontWeight: '800'
                  }}
                >
                  FIND US
                </span>

                <h2 style={{ margin: '8px 0' }}>
                  {isAm
                    ? 'በካርታ ላይ ያግኙን'
                    : 'Find Us on the Map'}
                </h2>

                <p style={{ color: '#6b7280' }}>
                  Addis Ababa, Ethiopia
                </p>

              </div>

              <div
                style={{
                  padding: '25px',
                  background: '#f8fafc',
                  textAlign: 'center'
                }}
              >

                <div
                  style={{
                    fontSize: '3rem',
                    marginBottom: '10px'
                  }}
                >
                  📍
                </div>

                <strong
                  style={{
                    display: 'block',
                    marginBottom: '15px'
                  }}
                >
                  Z Addis Hotel
                </strong>

                <a
                  href="https://maps.app.goo.gl/1JJCxy9X3AYUYEeDA"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    padding: '12px 22px',
                    background: '#4285F4',
                    color: '#fff',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontWeight: '700'
                  }}
                >
                  🗺️{' '}
                  {isAm
                    ? 'Google Maps ክፈት'
                    : 'Open Google Maps'}
                </a>

              </div>

            </div>

          </div>

        </div>

      </main>


      {/* CTA */}

      <section
        style={{
          background:
            'linear-gradient(135deg,#e67e22,#f39c12)',
          color: '#fff',
          textAlign: 'center',
          padding: '70px 20px'
        }}
      >

        <h2
          style={{
            fontSize: 'clamp(2rem,5vw,3rem)',
            marginBottom: '15px'
          }}
        >
          {isAm
            ? 'ወደ Z Addis Hotel እንኳን ደህና መጡ'
            : 'Welcome to Z Addis Hotel'}
        </h2>

        <p
          style={{
            maxWidth: '650px',
            margin: 'auto',
            lineHeight: 1.7
          }}
        >
          {isAm
            ? 'የሚረሳ ቆይታ ለማሳለፍ ዛሬውኑ ቦታዎን ያስይዙ።'
            : 'Reserve your stay today and enjoy a comfortable and memorable experience.'}
        </p>

      </section>


      {/* RESPONSIVE */}

      <style>
        {`
          input:focus,
          textarea:focus {
            outline: none;
            border-color: #e67e22 !important;
            box-shadow: 0 0 0 3px rgba(230,126,34,0.12);
          }

          button:hover {
            transform: translateY(-2px);
          }

          @media (max-width: 900px) {
            .contact-main-grid {
              grid-template-columns: 1fr !important;
            }

            .contact-info-grid {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 600px) {
            .form-two-columns {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

    </div>
  );
};


// INFO CARD

const InfoCard = ({ icon, title, value }) => {
  return (
    <div
      style={{
        background: '#fff',
        padding: '28px 22px',
        borderRadius: '18px',
        textAlign: 'center',
        boxShadow:
          '0 15px 40px rgba(0,0,0,0.09)'
      }}
    >

      <div
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: '#fff3e8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 15px',
          fontSize: '1.7rem'
        }}
      >
        {icon}
      </div>

      <h3 style={{ margin: '0 0 8px' }}>
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: '#6b7280',
          wordBreak: 'break-word'
        }}
      >
        {value}
      </p>

    </div>
  );
};


// CONTACT ROW

const ContactRow = ({ icon, title, value }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px'
      }}
    >

      <div
        style={{
          width: '45px',
          height: '45px',
          borderRadius: '12px',
          background:
            'rgba(243,156,18,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.2rem'
        }}
      >
        {icon}
      </div>

      <div>

        <small
          style={{
            display: 'block',
            color: '#94a3b8',
            marginBottom: '3px'
          }}
        >
          {title}
        </small>

        <strong style={{ color: '#fff' }}>
          {value}
        </strong>

      </div>

    </div>
  );
};


// STYLES

const labelStyle = {
  display: 'block',
  marginBottom: '8px',
  fontWeight: '700',
  color: '#374151'
};

const inputStyle = {
  width: '100%',
  padding: '14px 15px',
  borderRadius: '11px',
  border: '1px solid #dfe3e8',
  background: '#fff',
  color: '#172033',
  fontSize: '1rem',
  boxSizing: 'border-box'
};

export default Contact;
