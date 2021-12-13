

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

//token
const addToken = require('../inkvode_token')
const getBalanceToken = require('../inkvode_token_getBalance');
const getAccountId = require('../inkvode_token_getAccountId');
const transferToken = require('../inkvode_token_transfer')


const Noty = require("noty");
const { Query } = require('@firebase/firestore');
const { json } = require('express');

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

        //statistical
        async statistical(req,res){
            const {typeSearch, fromTime,toTime} = req.body;
            let result;
            if(fromTime != "" && toTime != ""){
                let dateFromTime = new Date(fromTime);
                let dateFromTo = new Date(toTime);
                let list1 = [];
                let listAllLandString = await queryAllLandsCoUserAndAdmin(req.session.user.userId,res.session.user.role);
                let listAllLand = JSON.parse(listAllLandString);

                for(let i = 0; i < listAllLand.length; i++){

                    let arrayDate = listAllLand[i].value.ThoiGianDangKy.split('-')
                    let splitDate= arrayDate[1].split('/');
                    let convertDateString = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0];
                    let dateLand = new Date(convertDateString)

                    if(dates.inRange(dateLand,fromTime,toTime)){
                        list1.push(listAllLand[i])
                    };
                }
                console.log(`dateFromTime : ${dateFromTime}`)
                console.log(`dateFromTo : ${dateFromTo}`)
                console.log(`list1 : ${list1}`)
                result = list1;
            }

        },

        //Search
        async searchWithCondition(req,res){
            const userId = req.session.user.userId;
            const {keySearch, typeSearch, fromTime,toTime} = req.body;

            const roleUser = req.session.user.role;

            let query  = {"docType":"land"};

            let allMenu;
            let listLandCo = [];
            let status;
            let listAllLand = [];

            if(typeSearch == "approved"){
                query["Status"] = "Đã duyệt";
                status = "Đã duyệt";
            }else if(typeSearch == "notApprovedYet"){
                query["Status"] = "Chưa duyệt";
                status = "Chưa duyệt";
            }else if(typeSearch == "transfering"){
                query["Status"] = "Đang chuyển";
                status = "Đang chuyển";
            }else if(typeSearch == "keyLand"){
                status = "keyLand";
            } else {
                status = "UserId";
            }
          

            console.log(keySearch == undefined)
            if(keySearch != "" && keySearch != undefined){
                console.log("DA VAO DAYyyyyyyyyyyyyyyyyyyyyyyy ")
                let listLandCoString;
                let listLandCoFilter;

                if(status != "UserId" && status != "keyLand"){
                    listLandCoString = await search(userId,JSON.stringify(query));;
                    listLandCoFilter = JSON.parse(listLandCoString);
                    listLandCo = listLandCoFilter.filter((element) => element.Status==status);
                }

                if(status == "UserId"){
                    listLandCoString = await queryAllLandCo(userId,keySearch.trim());
                    listLandCoFilter = JSON.parse(listLandCoString);
                    listLandCo = listLandCoFilter;
                    query['UserId'] = keySearch.trim();
                    console.log("QUERY : "+query)
                    let listAllLandString = await search(userId,JSON.stringify(query));
                    listAllLand = JSON.parse(listAllLandString);
                }
                
                  
                if(status == "keyLand"){
                    if(roleUser == "user"){
                        const menuString = await queryAllLand(req.session.user.userId,req.session.user.role); 
                        const menuCoString = await queryAllLandsCoUserAndAdmin(req.session.user.userId,req.session.user.role);
                        const menu = JSON.parse(menuString);
                        const menuCo = JSON.parse(menuCoString);
                        let result = [...menu,...menuCo];
                        console.log("RESULT : "+ JSON.stringify(result))
                        for(let i = 0 ; i < result.length; i++){

                            console.log("OKOK")
                         
                            let getKeyInResult = result[i]["key"];
                            let keyUserInput = keySearch.trim();

                            console.log("getKeyInResult "+getKeyInResult )
                            console.log("keyUserInput "+keyUserInput )

    
                            if(getKeyInResult == keyUserInput){
                                console.log("DA BANG")
                                listAllLand.push(result[i])
                            }
                        }
                    }else{
                        let listAllLandString = await search(userId,JSON.stringify(query));
                        listLandCoFilter = JSON.parse(listAllLandString);
                        for(let i = 0 ; i < listLandCoFilter.length; i++){
                         
                            let getKeyInResult = listLandCoFilter[i]["key"];
                            let keyUserInput = keySearch.trim();
    
                            if(getKeyInResult == keyUserInput){
                                console.log("DA BANG")
                                listAllLand.push(listLandCoFilter[i])
                            }
                        }
                    }
                   
                }


            
            }else{
                if(roleUser == "user"){
                    if(status != "keyLand"){

                        const menuString = await queryAllLand(req.session.user.userId,req.session.user.role); 
                        const menuCoString = await queryAllLandsCoUserAndAdmin(req.session.user.userId,req.session.user.role);
                        const menu = JSON.parse(menuString);
                        const menuCo = JSON.parse(menuCoString);
                        let result = [...menu,...menuCo];
                        listAllLand = result.filter((element) => element.value.Status==status);

                    }else{
                        const menuString = await queryAllLand(req.session.user.userId,req.session.user.role); 
                        const menuCoString = await queryAllLandsCoUserAndAdmin(req.session.user.userId,req.session.user.role);
                        const menu = JSON.parse(menuString);
                        const menuCo = JSON.parse(menuCoString);
                        listAllLand = [...menu,...menuCo];
                    }

                }else{
                    let listAllLandString = await search(userId,JSON.stringify(query));
                    listAllLand = JSON.parse(listAllLandString);
                }
               
            }

         
            allMenu = [...listAllLand,...listLandCo];


            if(fromTime != "" && toTime != ""){
                let dateFromTime = new Date(fromTime);
                let dateFromTo = new Date(toTime);
                let list1 = [];
                console.log(`locao: ${JSON.stringify(listLandCo)}`)
                for(let i = 0; i < allMenu.length; i++){

                    let arrayDate = allMenu[i].value.ThoiGianDangKy.split('-')
                    let splitDate= arrayDate[1].split('/');
                    let convertDateString = splitDate[2]+'-'+splitDate[1]+'-'+splitDate[0];
                    let dateLand = new Date(convertDateString)

                    // console.log(dateLand > fromTime)
                    // console.log(dateLand > toTime)
                    if(dates.inRange(dateLand,fromTime,toTime)){
                        list1.push(allMenu[i])
                    };
                }
                console.log(`dateFromTime : ${dateFromTime}`)
                console.log(`dateFromTo : ${dateFromTo}`)
                console.log(`list1 : ${list1}`)

                allMenu = list1;

            }

            return res.render("home",{ menu: allMenu, keySearch:keySearch, typeSearch:status, success: req.flash('success')});


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
        },

        // transfer token
        async handleTransferToken(req,res){

            const {from, to, amount} = req.body;
            try {
                await transferToken(req.session.user.userId, from, to, amount)
                req.flash("success","Chuyển tiền thành công")
                return res.redirect('/walletUser')
            } catch (error) {
                req.flash("error","Có lỗi xảy ra")
                return res.redirect('/walletUser')
            }
         
        }
     
    }
}

var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}




module.exports = userController;