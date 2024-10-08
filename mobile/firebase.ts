// mobile/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';

import { getFirestore, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAJ5lYftVNBOMH6oGpkyb_1Qzusv_ekbFE",
  authDomain: "emergency-response-track-a7751.firebaseapp.com",
  projectId: "emergency-response-track-a7751",
  storageBucket: "emergency-response-track-a7751.appspot.com",
  messagingSenderId: "444961312315",
  appId: "1:444961312315:web:cd09968bed9595ae6b961e",
  measurementId: "G-79JHY2CPJP"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);


export { serverTimestamp };
export { app };