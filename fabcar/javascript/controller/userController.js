

// import {firebase} from 'firebase'

const { saveMessage ,getUser, saveUser, updateInfo, getAllUserManager,getMessage, saveUserManager,deleteUserManager} = require('./saveUser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const enrollAdmin = require('../enrollAdmin')
const query = require('../queryTransfer');
const {register, auth} = require('../register')
const organizationsCA = ['ca.org1.example.com','ca.org2.example.com'];
const mspOrg = ['Org1MSP','Org2MSP'];
const affiliations = ['org1.department1','org2.department2'];

//default data
const queryAllLand = require("../queryAllLands")
const queryAllLandsCoUserAndAdmin = require("../queryAllLandsCoUserAndAdmin")
const queryAllLandCo = require("../queryAllLandsCo")



//search
const search = require('../searchWithCondition')

const addToken = require('../inkvode_token')
const getBalanceToken = require('../inkvode_token_getBalance');
const getAccountId = require('../inkvode_token_getAccountId');


const Noty = require("noty");
const { Query } = require('@firebase/firestore');

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

        //admin
        async uiAdmin(req,res){
            // let countWallet = await getBalanceToken(user.userId);
            // console.log(`countwallet: ${countWallet}`)
            // let check1 = await getClientToken(req.session.user.userId)
            // let check2 = await getClientBalance(req.session.user.userId)
            // console.log(`clientTOken : ${check1}`)
            // console.log(`clientTOken2 : ${check2}`) 
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

        //get ui add token
        async addToken(req,res){

            return res.render("addToken")
        },

        //handle add tokenP
        async handleAddToken(req,res){
            const userId = req.session.user.userId;
            const {amount, recipient} = req.body;

            await addToken(userId,amount,recipient);

            req.flash('success',"Đã nạp tiền thành công");
            return res.redirect('/addToken')
        },

        

        //Search
        async searchWithCondition(req,res){
            const userId = req.session.user.userId;
            const {keySearch, typeSearch, fromTime,toTime} = req.body;
            console.log(`key: ${keySearch}`)
            console.log(`type: ${typeSearch}`)
            console.log(`fromTime: ${fromTime}`)

            let query  = {"docType":"land"};

            let allMenu;
            let listLaneCo = [];
            let status;

            if(typeSearch == "approved"){
                query["Status"] = "Đã duyệt";
                status = "Đã duyệt";
            }else if(typeSearch == "notApprovedYet"){
                query["Status"] = "Chưa duyệt";
                status = "Chưa duyệt";
            }else if(typeSearch == "transfering"){
                query["Status"] = "Đang chuyển";
                status = "Đang chuyển";
            }else{

            }


            if(keySearch != ""){
                console.log("DA VAO DAYyyyyyyyyyyyyyyyyyyyyyyy")
                query["UserId"] = keySearch.trim();
                let listLaneCoString = await queryAllLandCo(keySearch.trim());
                let listLaneCoFilter = JSON.parse(listLaneCoString);
                listLaneCo = listLaneCoFilter.filter((element) => element.Status==status);

            }
            console.log(`locao: ${JSON.stringify(listLaneCo)}`)

            if(fromTime != "" && toTime != ""){
                let dateFromTime = new Date(fromTime);
                let dateFromTo = new Date(toTime);
                let list1;
                console.log(`locao: ${JSON.stringify(listLaneCo)}`)
                for(let i = 0; i < listLaneCo.length; i++){
                    console.log("chi so "+i)
                    // let arrayDate = listLaneCo[i].ThoiGianDangKy.split('-')
                    // let splitDate= arrayDate[1].split('/');
                    // let convertDateString = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0];
                    // let dateLand = new Date(convertDateString)
                    // console.log(`convertDateString`+splitDate)
                    // console.log(`splitDate`+splitDate)
                    // console.log(`dateString`+dateString)
                    // console.log(`dateLand`+dateLand)
                    // if(dateLand >= fromTime && dateLand <= toTime){
                    //     list1.push(listLaneCo[i])
                    // };
                }
                console.log(`dateFromTime : ${dateFromTime}`)
                console.log(`dateFromTo : ${dateFromTo}`)
                console.log(`list1 : ${list1}`)


            }

            let listAllLandString = await search(userId,JSON.stringify(query));
            let listAllLand = JSON.parse(listAllLandString);
            console.log(`quer2y2 : ${JSON.stringify(listAllLand)}`)
            allMenu = [...listAllLand,...listLaneCo];
            return res.render("home",{ menu: allMenu, keySearch:keySearch, typeSearch:status, success: req.flash('success')});



            // let date_ob = new Date();
            // let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
            // let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
            // let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
            // let thoigiandangky = `${time} - ${newDate}`;
            
            // let dateTest = new Date('2021/11/20')
            // let dateTest2 = new Date('2021/11/21')

            // console.log(`DATE: ${dateTest < dateTest2}`)

            // if(keySearch == ""){
            //     let allMenu;
            //     if(req.session.user.role == "user"){
            //       const menuString = await queryAllLand(req.session.user.userId,req.session.user.role); 
            //       const menuCoString = await queryAllLandCo(req.session.user.userId,req.session.user.role);
            //       const menu = JSON.parse(menuString);
            //       const menuCo = JSON.parse(menuCoString);
            //       allMenu = [...menu,...menuCo];
            //     }else if(req.session.user.role == "manager"){
            //       const menuString = await queryAllLand(req.session.user.userId,req.session.user.role); 
            //       const menu = JSON.parse(menuString);
            //       allMenu = menu;
                  
            //     }else{
            //       // admin
            //     }

            //     return res.render('searchWithCondition',{layout:false,menu : allMenu})
            // }else{
            //     const userId = req.session.user.userId;
            //     let listLandString = await search(userId,keySearch,typeSearch);
            //     let listLand = JSON.parse(listLandString);
            //     console.log(`list land : ${listLand}`)
            //      return res.render('searchWithCondition',{layout:false,menu : listLand})
            // }
        },

        //typeof search

        async typeOfSearch(req,res){

            const {typeOfSearch} = req.body;
            console.log(`typeof ${typeOfSearch}`)

            return res.render('typeOfSearch',{layout:false,typeOfSearch: typeOfSearch})
        },

        //infomation
        async infomation(req,res){
            const userId = req.session.user.userId;
            let listUser = await getUser(userId);
            let user = listUser[0];
            console.log(user.fullname)
            user.numberPhone = "0"+user.numberPhone.slice(3);

            return res.render('info',{user:user})
        },

        async handleSaveInfo(req,res){

            const { fullname , idCard, numberPhone } = req.body;
            const userId = req.session.user.userId;

            try {
                await updateInfo(userId,fullname,numberPhone,idCard);  
                req.flash('success', 'Lưu thành công');
                return res.redirect('/info')
            } catch (error) {
                req.flash('error', 'Lưu không thành công');
                return res.redirect('/info')
            }

          
        },

        // wallet
        
        async walletUser(req,res){
            const userId = req.session.user.userId;
            let balance = await getBalanceToken(userId)
            let acountIdToken = await getAccountId(userId)
            return res.render("walletUser",{acountIdToken:acountIdToken,balance:balance})
        }
     
    }
}

module.exports = userController;