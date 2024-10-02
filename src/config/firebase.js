// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyACyF1y3GyMcKcttHPS8s3_y3Idnh0OHE4",
  authDomain: "bitebalance-19593.firebaseapp.com",
  projectId: "bitebalance-19593",
  storageBucket: "bitebalance-19593.appspot.com",
  messagingSenderId: "901169843856",
  appId: "1:901169843856:web:06e150aaed0ccc426a5215",
  measurementId: "G-3BN1G4TN1X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };