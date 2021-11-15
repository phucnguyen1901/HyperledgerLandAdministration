

// import {firebase} from 'firebase'

const { saveMessage ,getUser, saveUser , getMessage} = require('./saveUser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const enrollAdmin = require('../enrollAdmin')
const query = require('../queryTransfer');
const {register, auth} = require('../register')
const organizationsCA = ['ca.org1.example.com','ca.org2.example.com'];
const mspOrg = ['Org1MSP','Org2MSP'];
const affiliations = ['org1.department1','org2.department2'];


function userController(){
    return {

        async login(req,res){
            // const email = "a@gmail.com";
            // await enrollAdmin();
            // await register(email,mspOrg[0],organizationsCA[0],affiliations[0]);
            // let result = await query(email);
            // console.log(result);
            // let listMessages = await getMessage("a@gmail.com");
            // let countMessages = listMessages.filter(e => e["Seen"] == false)
            // res.render("temp",{messages: listMessages,countMessages:countMessages.length})

            res.render("login",{layout:false,message: req.flash('message')})    
        },

        async fast(req,res){
            const nva = "a@gmail.com";
            const nvb = "b@gmail.com";
            const nvc = "c@gmail.com";
            await register(nva,mspOrg[0],organizationsCA[0],affiliations[0]),
            await register(nvb,mspOrg[0],organizationsCA[0],affiliations[0]),
            await register(nvc,mspOrg[0],organizationsCA[0],affiliations[0]),
            res.redirect('/login')
        },

        async handleLogin(req,res){
                const { email,password }  = req.body;
                const listUser = await getUser(email);
                if(listUser.length > 0){
                    let user = listUser[0];
                    bcrypt.compare(password, user.password,async function(err, result) {
                        if(result){
                            req.session.user = {"fullname":user.fullname,"role": user.role, "idCard":user.idCard,"userId":user.userId}
                            let ListMessages = await getMessage(email);
                            let countMessages = ListMessages.filter(e => e["Seen"] == false)
                            req.session.noty = {"listMessages":ListMessages, "countMessages":countMessages.length}
                            return res.redirect('/')
                        }
                        else{
                            req.flash('message','Sai email hoặc mật khẩu')
                            return res.redirect('/login')
                        }
                    });
                }else{
                    req.flash('message','Sai email hoặc mật khẩu')
                    return res.redirect('/login')

                }


            
        },

        async register(req,res){
            res.render("register",{layout:false , error: req.flash('error')})    
        },
        async handleRegister(req,res){
            let {numberPhone,idCard,fullname,password,passwordR,email} = req.body;  

            if(numberPhone[0] == "0"){
                numberPhone = "+84"+numberPhone.slice(1);
            }
            
            bcrypt.hash(password, saltRounds,async function(err, hash) {
                // Store hash in your password DB.
                if(err){
                    req.flash('error', 'Có lỗi xảy ra ! Đăng ký không thành công');
                    return res.redirect('/register');
                }
                try {
                      saveUser(email,fullname,numberPhone,idCard,hash)
                      await enrollAdmin();
                      await saveMessage(email,"Chào mừng bạn đã tham gia hệ thống")
                      await register(email,mspOrg[0],organizationsCA[0],affiliations[0]),
                      req.flash('message', 'Bạn đã đăng ký thành công ');
                      return res.redirect('/login');
                } catch (error) {
                    console.log("ERROR: "+error)
                    req.flash('error', 'Có lỗi xảy ra ! Đăng ký không thành công');
                    return res.redirect('/register');
                }
              
                
            });
            
        },

    //     async checkRegister(req,res){
    //           const {numberPhone,idCard,fullname,userId,password,passwordR} = req.body;   
    //         if(numberPhone == "" || idCard=="" || fullname == "" || userId == "" || password == ""){
    //             return res.render('register',{numberPhone:numberPhone,idCard:idCard})
    //         }
            
    //         if(password != passwordR){
    //             return res.render('register',{message:""})
    //         }
    //         // await saveUser(userId,fullname,numberPhone,idCard)
            
    //         res.render("handleRegister");
    //     }

    }
}

module.exports = userController;