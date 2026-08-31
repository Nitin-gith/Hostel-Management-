// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb4bh-55A6rDxGJmwOAVSdOyd8XhxYsQE",
  authDomain: "hostelmanagement-96232.firebaseapp.com",
  projectId: "hostelmanagement-96232",
  storageBucket: "hostelmanagement-96232.firebasestorage.app",
  messagingSenderId: "886576441298",
  appId: "1:886576441298:web:14eeee90d18e2e7553ca0b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)
export const auth = getAuth(app)