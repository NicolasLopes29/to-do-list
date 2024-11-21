// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDixleTwI1-HLeR0H9EIbk7VqXPdCN8xyI",
  authDomain: "todo-list-af840.firebaseapp.com",
  projectId: "todo-list-af840",
  storageBucket: "todo-list-af840.firebasestorage.app",
  messagingSenderId: "832365936395",
  appId: "1:832365936395:web:681e189ee8469077de2c0e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export {db}