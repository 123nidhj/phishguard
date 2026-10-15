import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCz8L_Cd0JnBQ7ob6VmVulPjseC-ipGnVU",
  authDomain: "phishguard-7d017.firebaseapp.com",
  projectId: "phishguard-7d017",
  storageBucket: "phishguard-7d017.firebasestorage.app",
  messagingSenderId: "645989516187",
  appId: "1:645989516187:web:6fc57bcc99bedbddc9173e",
  measurementId: "G-7RTC7BRVWJ"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
