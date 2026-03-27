import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyARDL-n7I3YC4LDtD7F3Q553TQTOAqWWJ0",
  authDomain: "nursury-39862.firebaseapp.com",
  projectId: "nursury-39862",
  storageBucket: "nursury-39862.firebasestorage.app",
  messagingSenderId: "785383914340",
  appId: "1:785383914340:web:29e65effa4f1d911db9871"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;
