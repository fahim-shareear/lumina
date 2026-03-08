// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// NOTE: This appears to be for a different project. For Lumina, create a new Firebase project
// and enable Authentication with Email/Password and Google providers
const firebaseConfig = {
  apiKey: "AIzaSyD1pwLreOaBpRehAY6WUz-HxxmMi8oiapY",
  authDomain: "etuition-bd-6b2cf.firebaseapp.com",
  projectId: "etuition-bd-6b2cf",
  storageBucket: "etuition-bd-6b2cf.firebasestorage.app",
  messagingSenderId: "868013217115",
  appId: "1:868013217115:web:d526e1f14d1d45d1ff767e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;