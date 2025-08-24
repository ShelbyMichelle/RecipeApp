import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {Firestore, getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyB7HbQTxFyJY7_nwOtxhWkZdaK39jBNI18",
  authDomain: "myrecipebook-4696e.firebaseapp.com",
  projectId: "myrecipebook-4696e",
  storageBucket: "myrecipebook-4696e.firebasestorage.app",
  messagingSenderId: "1053131618801",
  appId: "1:1053131618801:web:2cf1a1795989242a04ac50",
  measurementId: "G-2DB5QV94WE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app)

//export default app;