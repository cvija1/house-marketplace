import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC_CDwiFVhqu-lM7qsOFcDzqU3-SYdXsM8",
  authDomain: "house-marketplace-8c57d.firebaseapp.com",
  projectId: "house-marketplace-8c57d",
  storageBucket: "house-marketplace-8c57d.appspot.com",
  messagingSenderId: "322983690672",
  appId: "1:322983690672:web:303a55406ebe7de8d95675",
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
