

// import {firebase} from 'firebase'

const { getUser,saveUser ,loginUser} = require('./saveUser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const enrollAdmin = require('../enrollAdmin')
const query = require('../queryTransaction');
const initLedgeTrans = require("../inkvode_transfer")
const initLedgeMes = require("../inkvode_message")
const {register, auth} = require('../register')
const organizationsCA = ['ca.org1.example.com','ca.org2.example.com'];
const mspOrg = ['Org1MSP','Org2MSP'];
const affiliations = ['org1.department1','org2.department2'];


function userController(){
    return {
        async login(req,res){
            const email = "kobaogiopo2@gmail.com";
            await enrollAdmin();
            await register(email,mspOrg[0],organizationsCA[0],affiliations[0]);
            await initLedgeTrans(email)
            await initLedgeMes(email)
            let result = await query(email);

            res.render("login",{layout:false,message: req.flash('error')})    
        },

        async handleLogin(req,res){
            const { email,password }  = req.body;
            const listUser = await getUser(email);
            if(listUser.length > 0){
                let user = listUser[0];
                bcrypt.compare(password, user.password, function(err, result) {
                    if(result){
                        req.session.user = {"fullname":user.fullname,"role": user.role, "idCard":user.idCard,"userId":user.userId}
                        req.flash('error','Bạn đã tạo tài khoản thành công')
                        return res.redirect('/')
                    }
                    else{
                        req.flash('error','Sai email hoặc mật khẩu')
                        return res.redirect('/login')
                    }
                });
            }else{
                req.flash('error','Sai email hoặc mật khẩu')
                return res.redirect('/login')

            }

            
        },

        async register(req,res){
            res.render("register",{layout:false , error: req.flash('message')})    
        },
        async handleRegister(req,res){
            let {numberPhone,idCard,fullname,password,passwordR,email} = req.body;  

            if(numberPhone[0] == "0"){
                numberPhone = "+84"+numberPhone.slice(1);
            }
            
            bcrypt.hash(password, saltRounds,async function(err, hash) {
                // Store hash in your password DB.
                if(err){
                    req.flash('message', 'Có lỗi xảy ra ! Đăng ký không thành công');
                    return res.redirect('/register');
                }
                try {
                      saveUser(email,fullname,numberPhone,idCard,hash)
                      await enrollAdmin();
                      await register(email,mspOrg[0],organizationsCA[0],affiliations[0]),
                      req.flash('message', 'Bạn đã đăng ký thành công ');
                      return res.redirect('/login');
                } catch (error) {
                    req.flash('error', 'Có lỗi xảy ra ! Đăng ký không thành công');
                    return res.redirect('/register');
                }
              
                
            });
            
        },

        async checkRegister(req,res){
              const {numberPhone,idCard,fullname,userId,password,passwordR} = req.body;   
            if(numberPhone == "" || idCard=="" || fullname == "" || userId == "" || password == ""){
                return res.render('register',{numberPhone:numberPhone,idCard:idCard})
            }
            
            if(password != passwordR){
                return res.render('register',{message:""})
            }
            // await saveUser(userId,fullname,numberPhone,idCard)
            
            res.render("handleRegister");
        }

    }
}

module.exports = userController;