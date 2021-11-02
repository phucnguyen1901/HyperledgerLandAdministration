
const { initializeApp } = require("firebase/app")
const  { getAnalytics } = require("firebase/analytics")
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
// const analytics = getAnalytics(app);


module.exports = app;
