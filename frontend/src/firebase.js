// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-5177f.firebaseapp.com",
  projectId: "mern-estate-5177f",
  storageBucket: "mern-estate-5177f.firebasestorage.app",
  messagingSenderId: "1092338165614",
  appId: "1:1092338165614:web:ff208edde93f46a0f4c37f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);