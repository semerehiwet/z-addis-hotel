import React from 'react';
import { Link } from 'react-router-dom';

const Home = ({ lang }) => {

  const rooms = [
    {
      name: lang === 'am' ? 'ስታንዳርድ ክፍል' : 'Standard Room',
      price: '1,500 ETB',
      image: '/r1.jpg',
      description:
        lang === 'am'
          ? 'ለአንድ ምቹ እና ዘና ያለ ቆይታ የተዘጋጀ።'
          : 'A comfortable room designed for a relaxing stay.'
    },
    {
      name: lang === 'am' ? 'ትዊን ክፍል' : 'Twin Room',
      price: '2,000 ETB',
      image: '/r2.jpg',
      description:
        lang === 'am'
          ? 'ለጓደኞች እና ለቤተሰብ ተስማሚ የሆነ ሰፊ ክፍል።'
          : 'A spacious room ideal for friends and family.'
    },
    {
      name: lang === 'am' ? 'ዴሉክስ ክፍል' : 'Deluxe Room',
      price: '3,000 ETB',
      image: '/r3.jpg',
      description:
        lang === 'am'
          ? 'ዘመናዊ ዲዛይን እና ከፍተኛ ምቾት ያለው።'
          : 'Modern design combined with premium comfort.'
    }
  ];

  return (
    <div
      className="home-page"
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#263238',
        backgroundColor: '#ffffff',
        overflow: 'hidden'
      }}
    >

      {/* ================= HERO SECTION ================= */}
      <section
        style={{
          minHeight: '88vh',
          backgroundImage:
            'linear-gradient(90deg, rgba(8,15,30,0.82), rgba(8,15,30,0.45), rgba(8,15,30,0.70)), url("/g1.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          position: 'relative'
        }}
      >

        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '100px 25px',
            boxSizing: 'border-box'
          }}
        >

          <div
            style={{
              maxWidth: '760px',
              color: '#fff'
            }}
          >

            <div
              style={{
                display: 'inline-block',
                padding: '8px 18px',
                borderRadius: '30px',
                backgroundColor: 'rgba(230,126,34,0.18)',
                border: '1px solid rgba(255,255,255,0.3)',
                marginBottom: '25px',
                backdropFilter: 'blur(5px)'
              }}
            >
              ✨{' '}
              {lang === 'am'
                ? 'እንኳን ወደ Z Addis Hotel በደህና መጡ'
                : 'Welcome to Z Addis Hotel'}
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.5rem, 7vw, 5.2rem)',
                lineHeight: '1.08',
                margin: '0 0 25px',
                fontWeight: '800',
                letterSpacing: '-1px',
                textShadow: '0 4px 15px rgba(0,0,0,0.5)'
              }}
            >
              {lang === 'am'
                ? 'የማይረሳ ቆይታ፣ የኢትዮጵያ መስተንግዶ'
                : 'An Unforgettable Stay, Ethiopian Hospitality'}
            </h1>

            <p
              style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                lineHeight: '1.8',
                color: '#f1f1f1',
                maxWidth: '680px',
                marginBottom: '38px'
              }}
            >
              {lang === 'am'
                ? 'በዘመናዊ ምቾት፣ በልዩ መስተንግዶ እና በእውነተኛ የኢትዮጵያ ባህል የተሞላ ልዩ የሆነ የቆይታ ልምድ ይደሰቱ።'
                : 'Experience modern comfort, warm hospitality and the authentic spirit of Ethiopia in one unforgettable stay.'}
            </p>

            <div
              style={{
                display: 'flex',
                gap: '15px',
                flexWrap: 'wrap'
              }}
            >

              <Link
                to="/booking"
                style={{
                  backgroundColor: '#e67e22',
                  color: '#fff',
                  padding: '16px 32px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '1.05rem',
                  boxShadow: '0 8px 25px rgba(230,126,34,0.35)'
                }}
              >
                🛎️{' '}
                {lang === 'am'
                  ? 'አሁኑኑ ቦታ ይያዙ'
                  : 'Book Your Stay'}
              </Link>

              <Link
                to="/rooms"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  color: '#fff',
                  padding: '16px 32px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '1.05rem',
                  border: '1px solid rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(6px)'
                }}
              >
                🛏️{' '}
                {lang === 'am'
                  ? 'ክፍሎቻችንን ይመልከቱ'
                  : 'Explore Our Rooms'}
              </Link>

            </div>

          </div>
        </div>

        {/* HERO BOTTOM INFO */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            backgroundColor: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(8px)',
            padding: '18px 20px'
          }}
        >

          <div
            style={{
              maxWidth: '1100px',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              gap: '50px',
              flexWrap: 'wrap',
              color: '#fff',
              textAlign: 'center'
            }}
          >

            <div>
              <strong style={{ fontSize: '1.2rem' }}>⭐ 4.8/5</strong>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                {lang === 'am' ? 'የእንግዳዎች አስተያየት' : 'Guest Rating'}
              </div>
            </div>

            <div>
              <strong style={{ fontSize: '1.2rem' }}>24/7</strong>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                {lang === 'am' ? 'አገልግሎት' : 'Guest Service'}
              </div>
            </div>

            <div>
              <strong style={{ fontSize: '1.2rem' }}>📶 Wi-Fi</strong>
              <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                {lang === 'am' ? 'ነፃ ኢንተርኔት' : 'Free Internet'}
              </div>
            </div>

          </div>
        </div>

      </section>


      {/* ================= INTRODUCTION ================= */}
      <section
        style={{
          padding: '90px 20px',
          backgroundColor: '#fff'
        }}
      >

        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >

          <span
            style={{
              color: '#e67e22',
              fontWeight: '700',
              letterSpacing: '2px',
              fontSize: '0.9rem'
            }}
          >
            Z ADDIS HOTEL
          </span>

          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              margin: '15px 0 20px',
              color: '#172033'
            }}
          >
            {lang === 'am'
              ? 'ለእርስዎ ምቾት የተዘጋጀ ቆይታ'
              : 'A Stay Designed Around You'}
          </h2>

          <p
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              color: '#68707d',
              lineHeight: '1.9',
              fontSize: '1.05rem'
            }}
          >
            {lang === 'am'
              ? 'Z Addis Hotel የዘመናዊ ምቾትን ከኢትዮጵያዊ ሙቀት እና መስተንግዶ ጋር ያጣምራል። ለንግድ ጉዞ፣ ለቤተሰብ ቆይታ ወይም ለእረፍት ቢመጡ ምቹ እና የማይረሳ ልምድ ለመስጠት ተዘጋጅተናል።'
              : 'Z Addis Hotel combines modern comfort with the warmth of Ethiopian hospitality. Whether you are traveling for business, family or leisure, we are here to make your stay comfortable and memorable.'}
          </p>

        </div>

      </section>


      {/* ================= FEATURES ================= */}
      <section
        style={{
          padding: '80px 20px',
          backgroundColor: '#f7f8fa'
        }}
      >

        <div
          style={{
            maxWidth: '1150px',
            margin: '0 auto'
          }}
        >

          <div style={{ textAlign: 'center', marginBottom: '50px' }}>

            <span
              style={{
                color: '#e67e22',
                fontWeight: '700',
                letterSpacing: '1.5px'
              }}
            >
              {lang === 'am' ? 'ለምን Z ADDIS?' : 'WHY Z ADDIS?'}
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: '#172033',
                marginTop: '12px'
              }}
            >
              {lang === 'am'
                ? 'የሚፈልጉት ሁሉ በአንድ ቦታ'
                : 'Everything You Need in One Place'}
            </h2>

          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '25px'
            }}
          >

            {[
              {
                icon: '🛏️',
                title: lang === 'am' ? 'ምቹ ክፍሎች' : 'Comfortable Rooms',
                text:
                  lang === 'am'
                    ? 'ዘመናዊ እና ንፁህ ክፍሎች ለእርስዎ ምቾት ተዘጋጅተዋል።'
                    : 'Modern and clean rooms designed for your comfort.'
              },
              {
                icon: '🍽️',
                title: lang === 'am' ? 'ጥራት ያለው ምግብ' : 'Great Dining',
                text:
                  lang === 'am'
                    ? 'የኢትዮጵያ እና ዓለም አቀፍ ምግቦችን ይደሰቱ።'
                    : 'Enjoy Ethiopian and international cuisine.'
              },
              {
                icon: '📶',
                title: lang === 'am' ? 'ነፃ Wi-Fi' : 'Free Wi-Fi',
                text:
                  lang === 'am'
                    ? 'በቆይታዎ ሁሉ ፈጣን ኢንተርኔት ይጠቀሙ።'
                    : 'Stay connected with fast internet throughout your stay.'
              },
              {
                icon: '🕐',
                title: lang === 'am' ? '24/7 አገልግሎት' : '24/7 Service',
                text:
                  lang === 'am'
                    ? 'ለእንግዶቻችን በማንኛውም ሰዓት ዝግጁ ነን።'
                    : 'Our team is available whenever you need us.'
              }
            ].map((feature, index) => (

              <div
                key={index}
                style={{
                  backgroundColor: '#fff',
                  padding: '35px 25px',
                  borderRadius: '18px',
                  textAlign: 'center',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
                }}
              >

                <div style={{ fontSize: '3rem', marginBottom: '18px' }}>
                  {feature.icon}
                </div>

                <h3
                  style={{
                    color: '#172033',
                    marginBottom: '12px'
                  }}
                >
                  {feature.title}
                </h3>

                <p
                  style={{
                    color: '#6b7280',
                    lineHeight: '1.7',
                    margin: 0
                  }}
                >
                  {feature.text}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= ROOMS ================= */}
      <section
        style={{
          padding: '90px 20px',
          backgroundColor: '#fff'
        }}
      >

        <div
          style={{
            maxWidth: '1150px',
            margin: '0 auto'
          }}
        >

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'end',
              gap: '20px',
              flexWrap: 'wrap',
              marginBottom: '40px'
            }}
          >

            <div>

              <span
                style={{
                  color: '#e67e22',
                  fontWeight: '700'
                }}
              >
                {lang === 'am' ? 'የእኛ ክፍሎች' : 'OUR ROOMS'}
              </span>

              <h2
                style={{
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  color: '#172033',
                  margin: '10px 0 0'
                }}
              >
                {lang === 'am'
                  ? 'ለእርስዎ የሚስማማ ክፍል ይምረጡ'
                  : 'Choose Your Perfect Room'}
              </h2>

            </div>

            <Link
              to="/rooms"
              style={{
                color: '#e67e22',
                fontWeight: '700',
                textDecoration: 'none'
              }}
            >
              {lang === 'am' ? 'ሁሉንም ክፍሎች →' : 'View All Rooms →'}
            </Link>

          </div>


          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '28px'
            }}
          >

            {rooms.map((room, index) => (

              <div
                key={index}
                style={{
                  borderRadius: '18px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  boxShadow: '0 10px 35px rgba(0,0,0,0.09)'
                }}
              >

                <img
                  src={room.image}
                  alt={room.name}
                  style={{
                    width: '100%',
                    height: '230px',
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />

                <div style={{ padding: '25px' }}>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px'
                    }}
                  >

                    <h3
                      style={{
                        margin: 0,
                        color: '#172033'
                      }}
                    >
                      {room.name}
                    </h3>

                    <span
                      style={{
                        color: '#e67e22',
                        fontWeight: '800',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {room.price}
                    </span>

                  </div>

                  <p
                    style={{
                      color: '#6b7280',
                      lineHeight: '1.7',
                      margin: '15px 0 22px'
                    }}
                  >
                    {room.description}
                  </p>

                  <Link
                    to="/booking"
                    style={{
                      display: 'block',
                      textAlign: 'center',
                      backgroundColor: '#172033',
                      color: '#fff',
                      padding: '12px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontWeight: '700'
                    }}
                  >
                    {lang === 'am' ? 'ይዘዙ' : 'Book This Room'}
                  </Link>

                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= ETHIOPIAN HOSPITALITY ================= */}
      <section
        style={{
          padding: '100px 20px',
          backgroundImage:
            'linear-gradient(rgba(10,18,35,0.75), rgba(10,18,35,0.85)), url("/g2.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#fff'
        }}
      >

        <div
          style={{
            maxWidth: '1050px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >

          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>
            🇪🇹
          </div>

          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              marginBottom: '25px'
            }}
          >
            {lang === 'am'
              ? 'ኢትዮጵያዊ መስተንግዶ፣ በዘመናዊ ምቾት'
              : 'Ethiopian Hospitality, Modern Comfort'}
          </h2>

          <p
            style={{
              maxWidth: '760px',
              margin: '0 auto',
              lineHeight: '1.9',
              color: '#e5e7eb',
              fontSize: '1.08rem'
            }}
          >
            {lang === 'am'
              ? 'እንግዳችንን እንደ ቤተሰብ ማስተናገድ የእኛ ባህል ነው። በZ Addis Hotel የሚያሳልፉት ጊዜ ምቹ፣ ልዩ እና የማይረሳ እንዲሆን እንሰራለን።'
              : 'Welcoming guests like family is part of who we are. At Z Addis Hotel, we work to make every moment of your stay comfortable, personal and memorable.'}
          </p>

        </div>

      </section>


      {/* ================= GALLERY ================= */}
      <section
        style={{
          padding: '90px 20px',
          backgroundColor: '#f7f8fa'
        }}
      >

        <div
          style={{
            maxWidth: '1150px',
            margin: '0 auto'
          }}
        >

          <div
            style={{
              textAlign: 'center',
              marginBottom: '45px'
            }}
          >

            <span
              style={{
                color: '#e67e22',
                fontWeight: '700',
                letterSpacing: '1px'
              }}
            >
              {lang === 'am' ? 'ፎቶ ማዕከል' : 'GALLERY'}
            </span>

            <h2
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                color: '#172033',
                margin: '12px 0'
              }}
            >
              {lang === 'am'
                ? 'የZ Addis Hotel ውበት'
                : 'A Glimpse of Z Addis Hotel'}
            </h2>

          </div>


          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '15px'
            }}
          >

            {['/g1.jpg', '/g2.jpg', '/r1.jpg', '/r2.jpg', '/r3.jpg', '/r4.jpg'].map(
              (image, index) => (

                <div
                  key={index}
                  style={{
                    height: '220px',
                    overflow: 'hidden',
                    borderRadius: '15px'
                  }}
                >

                  <img
                    src={image}
                    alt={`Z Addis Hotel ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                  />

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* ================= FINAL CTA ================= */}
      <section
        style={{
          padding: '90px 20px',
          backgroundColor: '#e67e22',
          color: '#fff',
          textAlign: 'center'
        }}
      >

        <div
          style={{
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >

          <h2
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.3rem)',
              margin: '0 0 20px',
              lineHeight: '1.2'
            }}
          >
            {lang === 'am'
              ? 'የሚቀጥለውን ቆይታዎን ዛሬ ያቅዱ'
              : 'Plan Your Next Stay Today'}
          </h2>

          <p
            style={{
              fontSize: '1.1rem',
              lineHeight: '1.7',
              maxWidth: '650px',
              margin: '0 auto 30px',
              color: '#fff'
            }}
          >
            {lang === 'am'
              ? 'ምቹ ክፍል፣ ጥሩ ምግብ እና የማይረሳ መስተንግዶ ይጠብቅዎታል።'
              : 'Comfortable rooms, great dining and warm hospitality are waiting for you.'}
          </p>

          <Link
            to="/booking"
            style={{
              display: 'inline-block',
              backgroundColor: '#fff',
              color: '#e67e22',
              padding: '16px 35px',
              borderRadius: '50px',
              textDecoration: 'none',
              fontWeight: '800',
              fontSize: '1.05rem',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }}
          >
            🛎️ {lang === 'am' ? 'አሁኑኑ ይዘዙ' : 'Book Now'}
          </Link>

        </div>

      </section>

    </div>
  );
};

export default Home;
