import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5WwqiDw5uM09aiM4grQLQ2dHA4bz0Ni4",
  authDomain: "phisquard.firebaseapp.com",
  projectId: "phisquard",
  storageBucket: "phisquard.firebasestorage.app",
  messagingSenderId: "176259760839",
  appId: "1:176259760839:web:48aa4a54f5cb494246f4e2",
  measurementId: "G-EHGDV729BZ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
