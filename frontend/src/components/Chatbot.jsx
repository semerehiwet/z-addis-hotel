import React, { useState, useRef, useEffect } from 'react';

const Chatbot = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  
  const [messages, setMessages] = useState([
    { 
      sender: 'ai', 
      text: lang === 'am' 
        ? 'ሰላም! እንኳን ወደ Z Addis Hotel በደህና መጡ! እኔ የሆቴሉ ዲጂታል ረዳት ነኝ። ስለ ክፍሎቻችን፣ ምግባችን፣ ጂም፣ አድራሻችን ወይም ስለ ሆቴላችን መስተንግዶ ምን ላስረዳዎት?' 
        : 'Hello! Welcome to Z Addis Hotel! I am your digital assistant. What would you like to know about our rooms, natural food, gym, location, or hospitality?' 
    }
  ]);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // ድምፆችን አስቀድሞ ለማዘጋጀት (ለማምጣት)
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  // AI መልሱን በሴት ድምፅ የሚያነብበት ፈንክሽን
  const speakText = (text, language) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      // የኤችቲኤምኤል (HTML) ታጎችን ከድምፅ ንባቡ ውስጥ ለማውጣት (ሊንኩን እንዳያነበው)
      const cleanText = text.replace(/<[^>]*>?/gm, ''); 

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'am' ? 'am-ET' : 'en-US';
      utterance.rate = 0.9; 
      utterance.pitch = 1.2; // የሴት ድምፅ ቀጭን እንዲሆን (Higher pitch)

      // የሴት ድምፅ ለመምረጥ መሞከር
      const voices = window.speechSynthesis.getVoices();
      let femaleVoice = voices.find(v => 
        v.lang.includes(language === 'am' ? 'am' : 'en') && 
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('woman') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('zira'))
      );

      if (!femaleVoice) {
        // የሴት ድምፅ በስሙ ካልተገኘ፣ በቋንቋው ያለውን የመጀመሪያውን ይመርጣል
        femaleVoice = voices.find(v => v.lang.includes(language === 'am' ? 'am' : 'en'));
      }

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert(lang === 'am' ? 'ይቅርታ፣ የእርስዎ ብሮውሰር ድምፅ መቀበልን አይደግፍም። እባክዎ Google Chrome ይጠቀሙ።' : 'Sorry, your browser does not support voice input. Please use Google Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'am' ? 'am-ET' : 'en-US'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript); 
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
      // ኤረር ከተፈጠረ ለተጠቃሚው ማሳወቅ
      if (event.error === 'not-allowed') {
        alert(lang === 'am' ? 'እባክዎ ለማይክሮፎን ፈቃድ (Permission) ይስጡ።' : 'Please allow microphone access.');
      }
    };
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = "";
      const lowerInput = userText.toLowerCase();

      // 🇪🇹 የአማርኛ ሰፊ ምላሾች (Amharic Detailed Responses)
      if (lang === 'am') {
        if (lowerInput.includes('ክፍል') || lowerInput.includes('አልጋ') || lowerInput.includes('ዋጋ') || lowerInput.includes('ስንት')) {
          aiResponse = 'ክፍሎቻችን እጅግ ሰፊ፣ ንጹህ እና ዘመናዊ ናቸው! ስታንዳርድ ክፍል (2,500 ብር)፣ ትዊን ክፍል (3,500 ብር)፣ ዲለክስ ክፍል ከነ ጃኩዚው (5,000 ብር) እና የቅንጦት ፕሬዚደንሻል ስዊት (9,000 ብር) አሉን። ሁሉም ክፍሎች ነጻ ፈጣን ዋይፋይ፣ ሙቅ ውሃ፣ ስማርት ቲቪ እና እጅግ ምቹ አልጋዎች አሏቸው።';
        } else if (lowerInput.includes('ምግብ') || lowerInput.includes('ሬስቶራንት') || lowerInput.includes('ክትፎ') || lowerInput.includes('ዶሮ') || lowerInput.includes('ጣፋጭ')) {
          aiResponse = 'ምግቦቻችን እጅግ ጣፋጭ፣ ከተፈጥሯዊ እና ትኩስ ግብዓቶች (100% Organic) የሚዘጋጁ ናቸው! ደንበኞቻችንን ለማስደሰት ዋጋችን በጣም ቅናሽ እና ተመጣጣኝ ነው። የሀገር ባህል ምግቦችን እንደ ልዩ ክትፎ እና ዶሮ ወጥ፣ እንዲሁም አፍ የሚያስገምጡ የውጪ ምግቦችን በንጽህና እናቀርባለን።';
        } else if (lowerInput.includes('ጂም') || lowerInput.includes('ስፖርት') || lowerInput.includes('gym') || lowerInput.includes('ፓርክ') || lowerInput.includes('መኪና')) {
          aiResponse = 'ለጤናዎ እና ለደህንነትዎ ትልቅ ትኩረት እንሰጣለን! በሆቴላችን ዘመናዊ እና የተሟላ የጂም (Gym) ማዕከል አለን። በተጨማሪም ለእንግዶቻችን ሰፊ፣ ምቹ እና 24 ሰዓት ጥበቃ ያለው ነጻ የመኪና ማቆሚያ (Parking space) አዘጋጅተናል።';
        } else if (lowerInput.includes('አድራሻ') || lowerInput.includes('የት') || lowerInput.includes('ቦታ') || lowerInput.includes('ማፕ')) {
          // የተስተካከለው የጉግል ማፕ ሊንክ (አማርኛ)
          aiResponse = 'ሆቴላችን የሚገኘው በአዲስ አበባ ከተማ፣ ቦሌ አካባቢ ነው። ቦታውን በቀላሉ ለማግኘት እና በጉግል ማፕ (Google Maps) ለመምጣት <a href="https://maps.app.goo.gl/4eUWbppEqXcWiAsC7?g_st=ac" target="_blank" style="color: #3498db; text-decoration: underline; font-weight: bold;">እዚህ ይጫኑ</a>።';
        } else if (lowerInput.includes('ስለ') || lowerInput.includes('አቀባበል') || lowerInput.includes('ሆቴል')) {
          aiResponse = 'Z Addis Hotel የኢትዮጵያን ሞቅ ያለ የእንግዳ አቀባበል ከዘመናዊ የሆቴል አገልግሎት ጋር አጣምሮ የያዘ ምርጥ ሆቴል ነው። ለእንግዶቻችን ያለን ክብር፣ እንክብካቤ እና ፈገግታ ወደር የለውም፤ በቆይታዎ 100% ደስተኛ እንደሚሆኑ እናረጋግጣለን!';
        } else if (lowerInput.includes('ቡኪንግ') || lowerInput.includes('ማዘዝ') || lowerInput.includes('መያዝ')) {
          aiResponse = 'ክፍልዎን አሁኑኑ ለማዘዝ ከላይ ባለው ሜኑ "Booking" ወይም "አሁኑኑ ይዘዙ" የሚለውን በመጫን ፎርሙን ይሙሉ፤ ወዲያውኑ ቦታ እናስይዝሎታለን።';
        } else if (lowerInput.includes('ሰላም') || lowerInput.includes('ታዲያስ') || lowerInput.includes('እንደምን')) {
          aiResponse = 'ሰላም! እንኳን ወደ ምርጡ Z Addis Hotel በደህና መጡ! እኔ የሆቴሉ ዲጂታል ረዳት ነኝ። እንዴት ልርዳዎት?';
        } else {
          aiResponse = 'ይቅርታ፣ ጥያቄዎን በትክክል አልተረዳሁትም። ነገር ግን ስለ ሆቴላችን ምቹ ክፍሎች፣ ተፈጥሯዊ ምግቦች፣ ጂም፣ ወይም አድራሻችን በነጻነት ሊጠይቁኝ ይችላሉ።';
        }
      } 
      // 🇬🇧 የእንግሊዝኛ ሰፊ ምላሾች (English Detailed Responses)
      else {
        if (lowerInput.includes('room') || lowerInput.includes('bed') || lowerInput.includes('price') || lowerInput.includes('cost')) {
          aiResponse = 'Our rooms are extremely spacious, clean, and modern! We offer Standard (2,500 ETB), Twin (3,500 ETB), Deluxe with a Jacuzzi (5,000 ETB), and luxury Presidential Suites (9,000 ETB). All rooms feature high-speed free WiFi, hot showers, smart TVs, and plush beds.';
        } else if (lowerInput.includes('food') || lowerInput.includes('restaurant') || lowerInput.includes('eat') || lowerInput.includes('delicious') || lowerInput.includes('natural')) {
          aiResponse = 'Our meals are incredibly delicious, prepared with 100% natural and fresh organic ingredients! Best of all, our prices are very affordable and highly discounted. We proudly serve authentic traditional dishes like Kitfo and Doro Wot, alongside mouth-watering international cuisines.';
        } else if (lowerInput.includes('gym') || lowerInput.includes('fitness') || lowerInput.includes('park') || lowerInput.includes('car')) {
          aiResponse = 'We care deeply about your health and safety! Our hotel features a fully equipped, modern Gym and fitness center. We also provide a spacious, highly secure, and free 24-hour parking area for all our guests.';
        } else if (lowerInput.includes('location') || lowerInput.includes('where') || lowerInput.includes('address') || lowerInput.includes('map')) {
          // የተስተካከለው የጉግል ማፕ ሊንክ (English)
          aiResponse = 'We are conveniently located in the vibrant area of Bole, Addis Ababa. To easily find us on Google Maps for directions, please <a href="https://maps.app.goo.gl/4eUWbppEqXcWiAsC7?g_st=ac" target="_blank" style="color: #3498db; text-decoration: underline; font-weight: bold;">click here</a>.';
        } else if (lowerInput.includes('about') || lowerInput.includes('hospitality') || lowerInput.includes('hotel')) {
          aiResponse = 'Z Addis Hotel is a premier destination blending authentic Ethiopian hospitality with modern luxury. We treat our guests with the utmost respect and care, ensuring a 100% satisfying and memorable stay!';
        } else if (lowerInput.includes('book') || lowerInput.includes('reserve')) {
          aiResponse = 'To secure your stay, simply click on the "Booking" link in the top menu and fill out the quick form. We will have your room ready!';
        } else if (lowerInput.includes('hi') || lowerInput.includes('hello')) {
          aiResponse = 'Hello there! Welcome to the magnificent Z Addis Hotel. I am your AI assistant. How may I assist you today?';
        } else {
          aiResponse = 'I am sorry, I did not quite catch that. You can ask me about our luxurious rooms, delicious natural food, our gym, exact location, or how to book a stay!';
        }
      }

      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setIsTyping(false);
      
      // መልሱን ወዲያውኑ በድምፅ እንድታነበው ማዘዝ
      speakText(aiResponse, lang);

    }, 800); 
  };

  return (
    <div style={{ position: 'fixed', bottom: '100px', right: '20px', zIndex: 9999 }}>
      
      {isOpen && (
        <div style={{ width: '350px', height: '520px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', overflow: 'hidden', marginBottom: '15px', border: '1px solid #eee' }}>
          
          <div style={{ backgroundColor: '#2c3e50', padding: '15px', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.8rem' }}>👩🏽‍💼</span>
              <div>
                <strong style={{ fontSize: '1.1rem', display: 'block' }}>Z Addis AI (Sara)</strong>
                <span style={{ fontSize: '0.8rem', color: '#bdc3c7' }}>Online 🟢</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1.2rem' }}>✖</button>
          </div>

          <div style={{ flex: 1, padding: '15px', overflowY: 'auto', backgroundColor: '#f9f9f9', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {messages.map((msg, index) => (
              <div key={index} style={{ alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%', display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
                
                {msg.sender === 'ai' && (
                  <div style={{ fontSize: '1.5rem', marginBottom: '5px' }}>👩🏽‍💼</div>
                )}
                
                <div style={{ backgroundColor: msg.sender === 'user' ? '#e67e22' : '#fff', color: msg.sender === 'user' ? '#fff' : '#2c3e50', padding: '12px 16px', borderRadius: msg.sender === 'user' ? '15px 15px 0 15px' : '15px 15px 15px 0', fontSize: '0.95rem', lineHeight: '1.5', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', position: 'relative' }}>
                  
                  {/* HTML ሊንኮችን በትክክል በሰማያዊ ቀለም ክሊክ እንዲደረጉ አድርጎ ማሳያ (dangerouslySetInnerHTML) */}
                  <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                  
                  {msg.sender === 'ai' && (
                    <button 
                      onClick={() => speakText(msg.text, lang)} 
                      style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', position: 'absolute', bottom: '-22px', right: '0', color: '#3498db' }}
                      title={lang === 'am' ? 'በድምፅ ስማ' : 'Listen'}
                      >
                      🔊
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '8px', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem' }}>👩🏽‍💼</div>
                <div style={{ backgroundColor: '#fff', padding: '10px 15px', borderRadius: '15px 15px 15px 0', color: '#7f8c8d', fontSize: '0.9rem', fontStyle: 'italic', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                  {lang === 'am' ? 'እየጻፈች ነው...' : 'Typing...'}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', alignItems: 'center', padding: '15px', backgroundColor: '#fff', borderTop: '1px solid #eee' }}>
            
            <button 
              type="button" 
              onClick={startListening} 
              style={{ 
                background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.5rem', marginRight: '10px',
                color: isListening ? '#e74c3c' : '#7f8c8d', 
                animation: isListening ? 'pulse 1.5s infinite' : 'none'
              }}
              title={lang === 'am' ? 'ድምፅዎን ያስገቡ' : 'Speak'}
            >
              🎤
            </button>

            <input 
              type="text" 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              placeholder={isListening ? (lang === 'am' ? 'እየሰማሁ ነው...' : 'Listening...') : (lang === 'am' ? 'ጥያቄዎን ይጻፉ...' : 'Type here...')} 
              style={{ flex: 1, padding: '12px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', paddingLeft: '15px', fontSize: '0.95rem' }} 
            />
            
            <button type="submit" style={{ marginLeft: '10px', backgroundColor: '#2c3e50', color: '#fff', border: 'none', borderRadius: '50%', width: '45px', height: '45px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem', transition: 'background 0.3s' }}>
              ➤
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)} 
          style={{ backgroundColor: '#e67e22', color: '#fff', border: 'none', borderRadius: '50%', width: '65px', height: '65px', cursor: 'pointer', boxShadow: '0 5px 20px rgba(230,126,34,0.5)', fontSize: '2.2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', transition: 'transform 0.3s', animation: 'bounce 2s infinite' }}
        >
          🤖
        </button>
      )}
      
      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.2); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
