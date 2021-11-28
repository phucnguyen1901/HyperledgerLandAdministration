

// import {firebase} from 'firebase'

const { saveMessage ,getUser, saveUser , getAllUserManager,getMessage, saveUserManager,deleteUserManager} = require('./saveUser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const enrollAdmin = require('../enrollAdmin')
const query = require('../queryTransfer');
const {register, auth} = require('../register')
const organizationsCA = ['ca.org1.example.com','ca.org2.example.com'];
const mspOrg = ['Org1MSP','Org2MSP'];
const affiliations = ['org1.department1','org2.department2'];

//search

const search = require('../searchWithCondition')


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
            const nvd = "d@gmail.com";
            const nve = "e@gmail.com";
            const off = "office1@gmail.com";
            const admin = "admin@gmail.com";
            await register(nva,mspOrg[0],organizationsCA[0],affiliations[0]),
            await register(nvb,mspOrg[0],organizationsCA[0],affiliations[0]),
            await register(nvc,mspOrg[0],organizationsCA[0],affiliations[0]),
            await register(nvd,mspOrg[0],organizationsCA[0],affiliations[0]),
            await register(nve,mspOrg[0],organizationsCA[0],affiliations[0]),
            await register(admin,mspOrg[0],organizationsCA[0],affiliations[0]),
            await register(off,mspOrg[0],organizationsCA[0],affiliations[0]),

            res.redirect('/login')
        },

        async handleLogin(req,res){
                const { email,password }  = req.body;
                const listUser = await getUser(email);
                if(listUser.length > 0){
                    let user = listUser[0];
                    bcrypt.compare(password, user.password,async function(err, result) {
                        if(result){
                            if(user.role == 'user'){
                                req.session.user = {"fullname":user.fullname,"role": user.role, "idCard":user.idCard,"userId":user.userId}
                            }else{
                                req.session.user = {"nameOffice":user.nameOffice,"role": user.role, "userId":user.userId}
                            }
                            let ListMessages = await getMessage(email);
                            let countMessages = ListMessages.filter(e => e["Seen"] == false)
                            req.session.noty = {"listMessages":ListMessages, "countMessages":countMessages.length}
                            if(user.role == 'admin'){
                                return res.redirect('/admin')
                            }else{
                                return res.redirect('/')
                            }

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

        async uiAdmin(req,res){
            let listUserManager = await getAllUserManager()
            return res.render('admin',{listUserManager:listUserManager, success: req.flash('success'),error: req.flash('error')})
        },

        async adminAddManager(req,res){
            // await deleteUserManager("a@gmail.com")
            return res.render("adminAddUser")
        },

        async handleAddManager(req,res){
            const {userId, password , nameOffice, city} = req.body;

            bcrypt.hash(password, saltRounds,async function(err, hash) {
                // Store hash in your password DB.
                if(err){
                    req.flash('error', 'Có lỗi xảy ra ! Đăng ký không thành công');
                    return res.redirect('/register');
                }
                try {
                    await saveUserManager(userId,hash,nameOffice,city);
                    await register(userId,mspOrg[0],organizationsCA[0],affiliations[0]),
                    req.flash('success', 'Tạo văn phòng thành công');
                    return  res.redirect("/admin");
                } catch (error) {
                    console.log("ERROR: "+error)
                    req.flash('error', 'Có lỗi xảy ra ! Tạo ký không thành công');
                    return res.redirect('/admin');
                }
              
                
            });

        },

        async adminDeleteManager(req,res){

            const {userId} = req.body;

            try {
                await deleteUserManager(userId)
                req.flash('success', 'Xóa thành công');
                return res.redirect('/admin');
            } catch (error) {
                req.flash('error', 'Xóa không thành công');
                return res.redirect('/admin');
            }
        
        },
        //Search
        async searchWithCondition(req,res){
            const {keySearch, typeSearch} = req.body;
            console.log(`key: ${keySearch}`)
            console.log(`type: ${typeSearch}`)

            const userId = req.session.user.userId;
            let listLandString = await search(userId,keySearch,typeSearch);
            let listLand = JSON.parse(listLandString);
            console.log(`list land : ${listLand}`)
            return res.render('searchWithCondition',{layout:false,menu : listLand})
            // res.send("OK")
        }
     
    }
}

module.exports = userController;