



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


// window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
//  try {
//         const docRef = await addDoc(collection(db, "users"), {
//             Email: email,
//             FullName: fullname,
//             NumberPhone:numberPhone,
//             idCard: idCard
//         });
//         console.log("Document written with ID: ", docRef.id);
//         } catch (e) {
//         console.error("Error adding document: ", e);
// }

        
// var validateMyForm = function() {
//     return false;
// }

export default app;



// const registerButton = document.getElementById("registerButton");
// const sendOTPButton = document.getElementById("sendOTP");




// // x.id = "enterCode";

// registerButton.addEventListener("click",function(){
//   // saveUser();
//   console.log("Da click")
// })

// sendOTPButton.addEventListener("")





// window.validateMyForm = validateMyForm

// signInWithPhoneNumber(auth, "+84795418148", window.recaptchaVerifier)
//     .then((confirmationResult) => {
//       // SMS sent. Prompt user to type the code from the message, then sign the
//       // user in with confirmationResult.confirm(code).
//       console.log("Da vao day")
//       window.confirmationResult = confirmationResult;
//       // console.log(confirmationResult);
//       // ...
//     }).catch((error) => {
//       console.log("Error Send SMS")
//       console.log(`ERROR : ${error}`)
//       // Error; SMS not sent
//       // ...
//     });

// const code = getCodeFromUserInput();
// confirmationResult.confirm(code).then((result) => {
//   // User signed in successfully.
//   const user = result.user;
//   // ...
// }).catch((error) => {
//   // User couldn't sign in (bad verification code?)
//   // ...
// });



// try {
//   const docRef = await addDoc(collection(db, "users"), {
//     first: "Ada",
//     last: "Lovelace",
//     born: 1815
//   });
//   console.log("Document written with ID: ", docRef.id);
// } catch (e) {
//   console.error("Error adding document: ", e);
// }




// getCities(db)

// const phoneNumber = '+84795418148';

// const auth = getAuth(app);
// auth.languageCode = 'vn';





// function showCaptcha(){
//   window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
//     'size': 'invisible',
//     'callback': (response) => {
//       // reCAPTCHA solved, allow signInWithPhoneNumber.
//       console.log("Capcha through")
//       // onSignInSubmit();
//     }
//   }, auth);
// }



  // window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
  //   'size': 'invisible',
  //   'callback': (response) => {
  //     // reCAPTCHA solved, allow signInWithPhoneNumber.
  //     console.log("Capcha through")
  //     onSignInSubmit();
  //   }
  // }, auth);





    // signInWithPhoneNumber(auth, "+84795418148", window.recaptchaVerifier)
    //     .then((confirmationResult) => {
    //       // SMS sent. Prompt user to type the code from the message, then sign the
    //       // user in with confirmationResult.confirm(code).
    //       console.log("Da vao day")
    //       window.confirmationResult = confirmationResult;
    //       // console.log(confirmationResult);
    //       // ...
    //     }).catch((error) => {
    //       console.log("Error Send SMS")
    //       console.log(`ERROR : ${error}`)
    //       // Error; SMS not sent
    //       // ...
    //     });

  // signInWithPhoneNumber(auth,"+84795418148", window.recaptchaVerifier) 
  // .then(function(confirmationResult) {
  //   window.confirmationResult = confirmationResult;
  //   console.log(confirmationResult);
  // });


  // var myFunction = function() {
   
  // };

// const button = document.getElementById("getOTP");

// button.addEventListener("click",function(){
//    window.confirmationResult.confirm(document.getElementById("verificationcode").value)
//     .then(function(result) {
//       console.log(result);
//     }).catch(function(error) {
//       console.log(error);
//     });
// })




