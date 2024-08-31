import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "dressing-room-5351a",
  storageBucket: "dressing-room-5351a.appspot.com",
  messagingSenderId: "469724036052",
  appId: "1:469724036052:web:e5f89a9af84321286e3441",
  measurementId: "G-LP29NM87JR",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
