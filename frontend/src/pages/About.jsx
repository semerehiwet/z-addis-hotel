import React from 'react';

const About = ({ lang }) => {
  return (
    <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', lineHeight: '1.8' }}>
      
      {/*  തലጌ (Header) */}
      <h2 style={{ textAlign: 'center', color: '#e67e22', marginBottom: '15px', fontSize: '2.5rem' }}>
        {lang === 'am' ? 'ስለ Z Addis Hotel' : 'About Z Addis Hotel'}
      </h2>
      
      <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#555', marginBottom: '40px' }}>
        {lang === 'am' 
          ? 'አዲስ አበባ የሚገኝ ዘመናዊና ምቹ የኢትዮጵያ ሆቴል' 
          : 'A modern and welcoming Ethiopian hotel located in Addis Ababa'}
      </p>

      {/* ዋናው የይዘት ሳጥን */}
      <div style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '15px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        
        {lang === 'am' ? (
          // የአማርኛ 텍ስት
          <>
            <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '20px' }}>
              <b>Z Addis Hotel</b> በአዲስ አበባ የሚገኝ ዘመናዊና ምቹ የኢትዮጵያ ሆቴል ሲሆን፣ ለእንግዶቹ ከፍተኛ የእንግዳ አቀባበል፣ ምቾት እና ጥራት ያለው አገልግሎት ለመስጠት የተመሰረተ ነው።
            </p>
            <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '20px' }}>
              ሆቴላችን እንግዶችን በማስተናገድ ላይ የሚገኝ ሲሆን፣ ዓላማችን የኢትዮጵያን ሞቅ ያለ እንግዳ አቀባበል ከዘመናዊ የሆቴል አገልግሎት ጋር በማጣመር ለእያንዳንዱ እንግዳ የማይረሳ ቆይታ መፍጠር ነው።
            </p>
            <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '20px' }}>
              በምግብ ቤታችንም የኢትዮጵያን ባህላዊ ጣዕም ለእንግዶቻችን እናቀርባለን። ከሚገኙት ተወዳጅ የኢትዮጵያ ምግቦች መካከል <b>ዶሮ ወጥ እና ክትፎ</b> ይገኙበታል። ባህላዊ የኢትዮጵያ ጣዕምን በጥራት እና በጥንቃቄ ለማቅረብ እንጥራለን።
            </p>
            <p style={{ fontSize: '1.1rem', color: '#333' }}>
              <b>Z Addis Hotel</b> ለመኖር፣ ለመመገብ፣ ለመዝናናት እና ለልዩ ዝግጅቶች ተስማሚ ምቹ ስፍራ ነው። እንግዶቻችን በZ Addis Hotel የኢትዮጵያን ሙቀት፣ ባህል እና ዘመናዊ ምቾት በአንድ ላይ እንዲያገኙ እንፈልጋለን።
            </p>
          </>
        ) : (
          // የእንግሊዝኛ 텍ስት
          <>
            <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '20px' }}>
              <b>Z Addis Hotel</b> is a modern and welcoming Ethiopian hotel located in Addis Ababa, dedicated to providing guests with comfort, quality service, and genuine Ethiopian hospitality.
            </p>
            <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '20px' }}>
              Z Addis Hotel has been welcoming guests and creating comfortable and memorable stays. Our goal is to combine the warmth of Ethiopian hospitality with modern hotel services, creating an enjoyable experience for every guest.
            </p>
            <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '20px' }}>
              At our restaurant, we proudly offer authentic Ethiopian flavors alongside our hospitality. Guests can enjoy traditional Ethiopian dishes, including <b>Doro Wot and Kitfo</b>, prepared with care and attention to quality. Our food reflects the rich culinary culture and traditions of Ethiopia.
            </p>
            <p style={{ fontSize: '1.1rem', color: '#333' }}>
              Whether you are staying with us, enjoying a meal, relaxing, or celebrating a special occasion, Z Addis Hotel provides a comfortable and welcoming environment for every guest. At Z Addis Hotel, we bring together Ethiopian culture, warm hospitality, delicious traditional cuisine, and modern comfort to create an experience our guests will remember.
            </p>
          </>
        )}

      </div>
    </div>
  );
};

export default About;