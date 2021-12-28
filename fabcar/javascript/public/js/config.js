



// Import the functions you need from the SDKs you need
// import { initializeApp } from "/home/phuc/go/src/github/phucnguyen/fabric-samples/fabcar/javascript/node_modules/firebase/app";
// import { getAnalytics } from "/home/phuc/go/src/github/phucnguyen/fabric-samples/fabcar/javascript/node_modules/firebase/analytics";

import { initializeApp, getApps } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js'
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-analytics.js'

const firebaseConfig = {
  apiKey: "AIzaSyAr-9DOBFF_jr-tRybPow18Yl3a_JZp4cQ",
  authDomain: "hyperledger-7a30e.firebaseapp.com",
  projectId: "hyperledger-7a30e",
  storageBucket: "hyperledger-7a30e.appspot.com",
  messagingSenderId: "118697503350",
  appId: "1:118697503350:web:c6c6eb3651885fef26cd57",
  measurementId: "G-EKMBCBWH8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
