// web/src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJ5lYftVNBOMH6oGpkyb_1Qzusv_ekbFE",
  authDomain: "emergency-response-track-a7751.firebaseapp.com",
  projectId: "emergency-response-track-a7751",
  storageBucket: "emergency-response-track-a7751.appspot.com",
  messagingSenderId: "444961312315",
  appId: "1:444961312315:web:cd09968bed9595ae6b961e",
  measurementId: "G-79JHY2CPJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);