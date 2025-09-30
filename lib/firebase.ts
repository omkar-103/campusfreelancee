// lib/firebase.ts
import { initializeApp } from "firebase/app"
import { getAuth, GoogleAuthProvider } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// ✅ Use your Firebase project config directly
const firebaseConfig = {
  apiKey: "AIzaSyDHKZfc2-EQU4sFnKRvZA06iCDiPNgmBsQ",
  authDomain: "campusfreelance-3a79a.firebaseapp.com",
  projectId: "campusfreelance-3a79a",
  storageBucket: "campusfreelance-3a79a.firebasestorage.app",
  messagingSenderId: "608119948429",
  appId: "1:608119948429:web:28e4feb0e3e8260ca9cec4",
  measurementId: "G-MF1JJW17K5"
}

// ✅ Initialize Firebase only once
const app = initializeApp(firebaseConfig)

// ✅ Export Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()

export default app
