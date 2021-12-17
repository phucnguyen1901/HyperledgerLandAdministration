
    import { getAuth , RecaptchaVerifier , signInWithPhoneNumber} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'
    import app from '/js/config.js';
    import { getUser } from '/js/saveUser.js';

    const auth = getAuth(app);


    var numberPhone = "";
    var verifyCode;
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
    'size': 'invisible',
    'callback': (response) => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
        onSignInSubmit();
    }
    }, auth);

    let userId = document.getElementById("userTransfer").value;
    let user = await getUser(userId);
    numberPhone = user[0].numberPhone;
    console.log(numberPhone)



    // document.getElementById("check").addEventListener('click', async function(){
    //     let userId = document.getElementById("userId").value;
    //     let user = await getUser(userId);
    //     if(user.length < 1){
    //         document.getElementById("hoten").innerHTML = "Người nhận không có trong hệ thống";
    //         document.getElementById("hoten").style.color = "red";
    //         document.getElementById("confirm").style.display = "none"
    //     }else{
    //         numberPhone = user[0].numberPhone;
    //         document.getElementById("confirm").style.display = "block";
    //         document.getElementById("hoten").style.color =  "green";
    //         document.getElementById("hoten").innerHTML = "Họ tên : "+user[0].fullname+"<br>"+"CMND/CCCD : "+user[0].idCard;
    //     }
    // })

    document.getElementById("confirm").addEventListener('click',function(){
        let checkUser = document.getElementById('checkUser').value;
        console.log("Da vao day")
        let userId = document.getElementById("userTransfer").value;
        console.log(userId)

        if(checkUser == "true"){
            console.log("Da vao day")
            document.getElementById("showNumberPhone").innerHTML = 'Nhập OTP đã gửi về số điện thoại : '+numberPhone;
            signInWithPhoneNumber(auth, numberPhone, window.recaptchaVerifier)
                .then((confirmationResult) => {
                    console.log("Da send code")
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

            document.getElementById("submitOTP").addEventListener("click",function(){
                let code = document.getElementById("code").value;
                verifyCode.confirm(code).then((result) => {
                        // User signed in successfully.
                            console.log("Register successfully")
                            const user = result.user;
                            console.log(`User : ${user}`)
                            document.getElementById("formTransfer").submit();
                        // ...
                        }).catch((error) => {
                            alert("OTP không chính xác")
                        // User couldn't sign in (bad verification code?)
                        // ...
                    });
  })

        }
       
    })







    
