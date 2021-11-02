


    import { getAuth , RecaptchaVerifier , signInWithPhoneNumber} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js'
    import app from '/js/config.js';
    import { getUser } from '/js/saveUser.js';

    const auth = getAuth(app);
    const error = document.getElementById("error");

    const registerButton = document.getElementById("registerButton");

    registerButton.addEventListener("click", async function(){
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const passwordR = document.getElementById("passwordR").value;
        const fullname = document.getElementById("fullname").value;
        const idCard = document.getElementById("idCard").value;
        const numberPhone = document.getElementById("numberPhone").value;

        error.style.color = "green";
        error.style.display = "block"
        error.innerHTML = "Đang kiểm tra";

        if(email == "" || password == "" || fullname == "" || idCard == "" || numberPhone == ""){
            error.style.color = "red"
            return error.innerHTML = "Vui lòng nhập đầy đủ thông tin";
        }

   
        var user = await getUser(email);

        if(user.length > 0){
            error.style.color = "red"
            return error.innerHTML = "Email đã được sử dụng";
        }



        if(password != passwordR){
            error.style.color = "red"
            return error.innerHTML = "Mật khẩu nhập lại không chính xác"
        }

        document.getElementById("registerForm").submit();

    })

    