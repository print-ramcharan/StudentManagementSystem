// src/firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBiozLd-sLUUehzemkCFIExq7OQI8Do0r0",
  authDomain: "studentmanagementsystem-42862.firebaseapp.com",
  projectId: "studentmanagementsystem-42862",
  storageBucket: "studentmanagementsystem-42862.firebasestorage.app",
  messagingSenderId: "230656990619",
  appId: "1:230656990619:web:906f61a86f8029908f553e",
  measurementId: "G-BLQ1TMFVER"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider,db  };
