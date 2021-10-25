

function userController(){
    return {
        async login(req,res){
            res.render("login",{layout:false})    
        },
        async register(req,res){
            res.render("register",{layout:false})    
        },
        async handleRegister(req,res){
            const {numberPhone,otp,idCard,fullname,email} = req.body;
            console.log(numberPhone);
            console.log(otp);
            console.log(idCard);
            res.render("handleRegister");
        },

        async handleLogin(req,res){
            res.render("handleLogin")
        }


    }
}

module.exports = userController;