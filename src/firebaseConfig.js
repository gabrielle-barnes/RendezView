import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyAc5WHXAuB1rrIiJvFMZ_1m1d1jLq7EyBQ",
  authDomain: "rendezview-40b14.firebaseapp.com",
  projectId: "rendezview-40b14",
  storageBucket: "rendezview-40b14.firebasestorage.app",
  messagingSenderId: "253267365301",
  appId: "1:253267365301:web:4e7c721a6b9023387b9dfc",
}

export const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
