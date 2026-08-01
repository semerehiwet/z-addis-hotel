import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ይህ አዲስ ነው

const firebaseConfig = {
  apiKey: "AIzaSyBIv6wPguBOXzb_zlmfGlrLT9bhw_guzd4",
  authDomain: "z-addis-hotel-da960.firebaseapp.com",
  projectId: "z-addis-hotel-da960",
  storageBucket: "z-addis-hotel-da960.firebasestorage.app",
  messagingSenderId: "742429931544",
  appId: "1:742429931544:web:b6fc2334cf656b59b56b6d",
  measurementId: "G-B73Z2XZ02Q"
};

// ፋየርቤዝን ማስጀመር
const app = initializeApp(firebaseConfig);

// ዳታቤዙን እና የጥበቃ ሲስተሙን ለሌሎች ፋይሎች ክፍት ማድረግ
export const db = getFirestore(app);
export const auth = getAuth(app); // ይህ አዲስ ነው