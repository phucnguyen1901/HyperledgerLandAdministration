


    import { getAuth , RecaptchaVerifier , signInWithPhoneNumber} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'
    import app from '/js/config.js';
    import saveUser from '/js/saveUser.js';

    const auth = getAuth(app);

    const sendOTP = document.getElementById("sendOTPButton");
    const registerButton = document.getElementById("registerButton");

    var verifyCode;
   
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);
    sendOTP.addEventListener("click",function(){
        signInWithPhoneNumber(auth, "+84795418148", window.recaptchaVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                console.log("Da vao day")
                window.confirmationResult = confirmationResult;
                verifyCode = confirmationResult;
                // return confirmationResult;
            // console.log(confirmationResult);
            // ...
            }).catch((error) => {
                console.log("Error Send SMS")
                console.log(`ERROR : ${error}`)
                // Error; SMS not sent
                // ...
            });
     
    })
    
    registerButton.addEventListener("click",function(){
        const numberPhone = document.getElementById("numberPhone").value;
        const email = document.getElementById("email").value;
        const fullname = document.getElementById("fullname").value;
        const idCard = document.getElementById("idCard").value
        const code = document.getElementById("otp").value

        verifyCode.confirm(code).then((result) => {
            // User signed in successfully.
                console.log("Register successfully")
                saveUser(email,fullname,numberPhone,idCard)
                document.getElementById("registerForm").submit();
                const user = result.user;
                console.log(`User : ${user}`)
            // ...
            }).catch((error) => {
                console.log("Register failed")
            // User couldn't sign in (bad verification code?)
            // ...
        });
        
     
    })

    