import { getFirestore } from 'firebase/firestore';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbPtivRBx4mLYHgiIzeISsTfRc303LKfo",
  authDomain: "thatopenmaster.firebaseapp.com",
  projectId: "thatopenmaster",
  storageBucket: "thatopenmaster.appspot.com",
  messagingSenderId: "301123543503",
  appId: "1:301123543503:web:b8fea09da1a2b5d15a72ba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firebaseDB = getFirestore()