// Simple Firebase connection test
const { initializeApp } = require("firebase/app");
const { getAuth, signInAnonymously } = require("firebase/auth");
const { getFirestore, collection, addDoc, serverTimestamp } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyD5WwqiDw5uM09aiM4grQLQ2dHA4bz0Ni4",
  authDomain: "phisquard.firebaseapp.com",
  projectId: "phisquard",
  storageBucket: "phisquard.firebasestorage.app",
  messagingSenderId: "176259760839",
  appId: "1:176259760839:web:48aa4a54f5cb494246f4e2",
  measurementId: "G-EHGDV729BZ"
};

async function testFirebase() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const db = getFirestore(app);
    
    console.log('Firebase initialized successfully');
    
    console.log('Attempting anonymous login...');
    const userCredential = await signInAnonymously(auth);
    const user = userCredential.user;
    console.log('Anonymous login successful:', user.uid);
    
    console.log('Testing Firestore write...');
    const testData = {
      url: 'https://test.com',
      prediction: 'Legit',
      confidence: 95.5,
      threat_level: 'Low',
      risk_score: 10,
      timestamp: serverTimestamp(),
      user_id: user.uid,
      test: true
    };
    
    const scansRef = collection(db, 'users', user.uid, 'scans');
    const docRef = await addDoc(scansRef, testData);
    console.log('Test document written with ID:', docRef.id);
    
    console.log('✅ Firebase test completed successfully!');
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
  }
}

testFirebase();
