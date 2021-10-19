







function userController(){
    return {
        async login(req,res){
            res.render("login",{layout:false})    
        },
        async register(req,res){
            res.render("register",{layout:false})    
        },
        async handleRegister(req,res){
            res.render("handleRegister");
        }
    }
}

module.exports = userController;