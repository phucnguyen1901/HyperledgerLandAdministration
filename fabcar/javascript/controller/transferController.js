
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
        },

          async transferLandOne(req,res){
            let key = req.params.key;
            res.render("transferLand",{layout:false, key:key})
          },
      
      
          async transferLandCo(req,res){
            let key = req.params.key;
            res.render("transferLandCo",{layout:false, key:key})
          },
      
          async blank(req,res){
            res.render("blank",{layout:false})
          },
      
          async transferLandFormOwner(req,res){
            const count = req.params.count;
            res.render("transferLandCountCo",{layout:false,count:count})
          },
    }
}

module.exports = transferController;