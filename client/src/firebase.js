// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "blog-web-app-90970.firebaseapp.com",
  projectId: "blog-web-app-90970",
  storageBucket: "blog-web-app-90970.appspot.com",
  messagingSenderId: "884038916536",
  appId: "1:884038916536:web:1ad4f5d02309734914d74d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);