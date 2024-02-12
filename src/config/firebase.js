// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCV40dgUp8eVdQmSB9lAAW3yDd5QIHj_wI",
  authDomain: "recipe-app-test-f4f95.firebaseapp.com",
  projectId: "recipe-app-test-f4f95",
  storageBucket: "recipe-app-test-f4f95.appspot.com",
  messagingSenderId: "525553465097",
  appId: "1:525553465097:web:69970bfed999a14211c5d8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvidor = new GoogleAuthProvider();
export const db = getFirestore(app);
const storage = getStorage(app);
export default storage;
