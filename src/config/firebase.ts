import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyA_WvNasCAuVaVlg8Xcn5we7ahcwu6QQk4",
  authDomain: "fisabillah-28eaa.firebaseapp.com",
  projectId: "fisabillah-28eaa",
  storageBucket: "fisabillah-28eaa.firebasestorage.app",
  messagingSenderId: "99650508135",
  appId: "1:99650508135:web:e12b58bfe5bf4fb635cbc2",
  measurementId: "G-H6DRTLT3WY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
