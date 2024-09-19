// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCItzpV0jGiGUGn5QNfXX0PmIjH9lgE50M",
  authDomain: "todolist-71e90.firebaseapp.com",
  projectId: "todolist-71e90",
  storageBucket: "todolist-71e90.appspot.com",
  messagingSenderId: "812609791122",
  appId: "1:812609791122:web:6fa005523e0a91414c324b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
