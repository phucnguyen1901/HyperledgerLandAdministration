


    import { getAuth , RecaptchaVerifier , signInWithPhoneNumber} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'
    import app from '/js/config.js';

    const auth = getAuth(app);

    const registerButton = document.getElementById("registerButton");
   

    registerButton.addEventListener("click",function(){
         window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {}, auth);

        signInWithPhoneNumber(auth, "+84795418148", window.recaptchaVerifier)
            .then((confirmationResult) => {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                console.log("Da vao day")
                window.confirmationResult = confirmationResult;
                document.getElementById("registerForm").submit();
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
    
    // export default confirmResult;


    