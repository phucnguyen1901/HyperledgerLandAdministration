

    import { getAuth , RecaptchaVerifier , signInWithPhoneNumber} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'
    import app from '/js/config.js';

    var verifyCode;

    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
            // reCAPTCHA solved, allow signInWithPhoneNumber.
            onSignInSubmit();
        }
    }, auth);



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


    const registerButton = document.getElementById("registerButton");

    registerButton.addEventListener("click",function(){
        verifyCode.confirm(code).then((result) => {
                // User signed in successfully.
                    console.log("Register successfully")
                    document.getElementById("registerForm").submit();
                    const user = result.user;
                    console.log(`User : ${user}`)
                // ...
                }).catch((error) => {
                    console.log("Register failed")
                    document.getElementById("registerForm").submit();
                })
                    
    })

