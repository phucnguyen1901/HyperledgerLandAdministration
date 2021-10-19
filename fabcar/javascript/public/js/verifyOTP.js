
import confirmResult from "/js/requestOTP.js";

    confirmResult()

    const verifyOTP = document.getElementById("verifyOTP");

    verifyOTP.addEventListener("click",function(){
        const code = document.getElementById("code").value;
        confirmResult.confirm(code).then((result) => {
            // User signed in successfully.
                console.log("Register successfully")
                const user = result.user;
                console.log(user)
            // ...
            }).catch((error) => {
                console.log("Register failed")
            // User couldn't sign in (bad verification code?)
            // ...
        });
    })

   





