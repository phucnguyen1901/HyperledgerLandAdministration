
    import '/js/loginUser.js'

    document.getElementById("login").addEventListener("click",function(){
                        var code = document.getElementById("code").value;
                        confirmationResult.confirm(code).then((result) => {
                                // User signed in successfully.
                                const user = result.user;
                                // ...
                                }).catch((error) => {
                                // User couldn't sign in (bad verification code?)
                                // ...
                                });
                        })










    // import verify from "/js/test.js";

    // const confirmOTP = document.getElementById("confirmOTP")
    // const code = document.getElementById("code");
    // confirmOTP.addEventListener("click",function(){
    //     console.log("OK")
    //     verifyCode.confirm(code).then((result) => {
    //         // User signed in successfully.
    //             console.log("Register successfully")
    //             const user = result.user;
    //             console.log(`User : ${user}`)
    //         // ...
    //         }).catch((error) => {
    //             console.log("Register failed")
    //         // User couldn't sign in (bad verification code?)
    //         // ...
    //     });
    // })