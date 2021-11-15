
const {getUser} = require('./saveUser')


function transferController() {
    return {
        async checkUserExistAndReturnInfo(req,res){
            const {email} = req.body;
            console.log(email);
            if(email == req.session.user.userId){
                return res.render("checkUserExist",{layout:false , checkEmail:true})
            }
            let listUser = await getUser(email);
            res.render("checkUserExist",{layout:false ,listUser:listUser, checkEmail:false})
        }
    }
}

module.exports = transferController;