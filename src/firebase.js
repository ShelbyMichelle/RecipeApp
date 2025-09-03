// Import Firebase v9+ SDK functions
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase project configuration object
// This contains all the keys and identifiers for your specific Firebase project
const firebaseConfig = {
  apiKey: "AIzaSyB7HbQTxFyJY7_nwOtxhWkZdaK39jBNI18",              // API key for Firebase services
  authDomain: "myrecipebook-4696e.firebaseapp.com",                // Domain for Firebase Authentication
  projectId: "myrecipebook-4696e",                                 // Unique project identifier
  storageBucket: "myrecipebook-4696e.firebasestorage.app",         // Cloud Storage bucket URL
  messagingSenderId: "1053131618801",                              // Sender ID for Firebase Cloud Messaging
  appId: "1:1053131618801:web:2cf1a1795989242a04ac50",             // Unique app identifier
  measurementId: "G-2DB5QV94WE"                                    // Google Analytics measurement ID
};

// Initialize Firebase app with the configuration
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication
// This allows users to sign in/sign up using various methods
export const auth = getAuth(app);

// Initialize and export Google Auth Provider
// This specifically enables Google Sign-In functionality
export const googleProvider = new GoogleAuthProvider();

// Initialize and export Firestore Database
// This allows you to read/write data to your Firebase database
export const db = getFirestore(app);


//export default app;