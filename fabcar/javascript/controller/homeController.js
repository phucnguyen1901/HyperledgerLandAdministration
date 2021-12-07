
const queryAllLand = require("../queryAllLands")
const queryAllLandCoAndAdmin = require("../queryAllLandsCoUserAndAdmin")
const query = require("../queryLand")
const invokeLandOne = require('../invoke_land_One')
const invokeLandCo = require('../invoke_land_Co')
// const transfer = require('../transferLand')
const createTransfer = require('../inkvode_transfer_OneToOne')
const createTransferOneToCo = require('../inkvode_transfer_OneToCo')
const createTransferCoToCo = require('../inkvode_transfer_CoToCo')
const createTransferCoToOne = require('../inkvode_transfer_CoToOne')

const {saveMessage,getMessage , getUser} = require('./saveUser')

const updateLand = require('../updateLand')
const checkLandOwner = require('../checkLandOwner')
const checkLandOwnerCo = require('../checkLandOwnerCo')

const changeLandOwner = require('../confirmTransferLand')

const queryAllTransferReceiver = require('../queryAllTransferReceiver') // user receive

const queryAllTransferOwner = require('../queryTransferOwner') // user
const queryAllTransferOwnerCo = require('../queryTransferOwnerCo')

const queryAllTransfer = require('../queryAllTransfer') // admin
const queryTransferOne = require('../queryTransferOne')


const updateTransfer = require('../updateTransfer')
const updateTransferCo = require('../updateTransferCo')
const cancleTransferFromUser = require('../cancleTransferFromUser')

const formidable = require('formidable');


const saveMessageTransferLandSuccessLoop = require('./saveMessageLoop')


const modifyLand = require('../modifyLand')
const { stringify } = require("@firebase/util")




const StatusLane = {
  NotApprovedYet: "Chưa duyệt",
  Transfering: "Đang chuyển",
  Done: "Đã duyệt"
}



function homeController() {
  return {
    async index(req, res) {
        try {
            let allMenu;
            if(req.session.user.role == "user"){
              const menuString = await queryAllLand(req.session.user.userId,req.session.user.role); 
              const menuCoString = await queryAllLandCoAndAdmin(req.session.user.userId,req.session.user.role);
              const menu = JSON.parse(menuString);
              const menuCo = JSON.parse(menuCoString);
              allMenu = [...menu,...menuCo];
            }else if(req.session.user.role == "manager"){
              const menuString = await queryAllLand(req.session.user.userId,req.session.user.role); 
              const menu = JSON.parse(menuString);
              allMenu = menu;
            }else{
              // admin
            }
            return res.render("home",{ menu: allMenu, keySearch:"",typeSearch:"UserId",  success: req.flash('success')});

        } catch (error) {
          console.log("Login khong thanh cong : "+error)
          req.flash('message',"Sai email hoặc mật khẩu")
          return res.redirect('/login')
        }

    },

    async transferAdmin(req,res){
      const transString = await queryAllTransfer(req.session.user.userId);
      const result = JSON.parse(transString);
      return res.render("allTransfer", {menu: result})
    },

    async detail(req,res){
        const key = req.params.key;
        const notFound = 'Not Found';
        const userId = req.session.user.userId;
        const detail = await query(key,userId);
        const obj = JSON.parse(detail);
        console.dir(obj)
        
        if(detail == 'Not found'){
          return res.render("detail",{ detail: notFound });
        }

        let requestPerson;
        if(req.session.user.role == "manager") {
          requestPerson = "manager";
        }else{
          requestPerson = "transferUser";
        }

        return res.render("detail",{ detail: obj, key: key, requestPerson: requestPerson});

    },

    async detailReceive(req,res){
      const {key,keyTransfer,confirmed,position} = req.body;
      console.log(`key :`+key)
      const userId = req.session.user.userId;
      try {
          const detail = await query(key,userId);
          const obj = JSON.parse(detail);
          return res.render("detail",{ detail: obj,confirmed:confirmed,keyTransfer:keyTransfer,position:position,requestPerson: 'receiveUser'});
      } catch (error) {
        console.log("Loi roi"+error)
        req.flash("error","Xảy ra lỗi")
        // return res.redirect("/receiveLand")
        res.send("Loi roi")
      }

    },

    async demoSubmit(req,res){
      try {
        const toadocacdinh = '{"D1": [406836.70,1183891.04],"D2": [406836.75,1183891.44],"D3": [406836.80,1183891.37],"D4": [406836.79,1183891.40]}';
        const chieudaicaccanh = '{"C12": 20.5, "C23": 1.12, "C34":7.53, "C41" :15.5}';
        await invokeLandOne('Land5','Phuc Nguyen',"Nam",'12312312','Ca Mau',192,1,[123,124,125],1200,toadocacdinh,
        chieudaicaccanh,
        "Chung","Mua ban","vinh vien","Mua cua nha nuoc","18/9/2025");
        // res.send('OK');
        res.redirect('http://localhost:3000/');
      } catch (error) {
         res.send(error);
      }
    },

    async addAsset(req,res){
      res.render("addAssetHome")
    },

    async addAssetOne(req,res){
      res.render("addAsset",{layout:false})
    },


    async addAssetCo(req,res){
      res.render("addAssetCo",{layout:false})
    },

    async blank(req,res){
      res.render("blank",{layout:false})
    },

    async addAssetFormOwner(req,res){
      const {count, listCoOwner} = req.body;

      let data = []
      if(listCoOwner != ""){
        data = listCoOwner.split(',')

      }

      let userId = req.session.user.userId;
      let result = []
      for(let el of data){
        if(el !== userId){
          result.push(el)
        }
      }

      res.render("addAssetFormOwner",{layout:false,count:count,data:result})
    },

    //add coordinates
    async addCoordinatesForm(req,res){
      const {count} = req.body;

      console.log("count : "+count)
      res.render("addCoordinatesForm",{layout:false,count:count})
    },

    //add lengths
    async addLength(req,res){
      const count = req.body.count;
      console.log("count : "+count)
      res.render("addLength",{layout:false,count:count})
    },


    //các số thửa giáp ranh
    async addParcels(req,res){
      const { count , parcels} = req.body;
      let data = []
      console.log(parcels);
      if(parcels != ""){
        data = parcels.split(",")
      }
      console.log('count ne : '+parcels)
      res.render('addParcels',{layout:false,count:count, data: data})
    },


    

    async handleAddAsset(req,res){
      const {thuasodat,tobandoso,dientich,hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,url,landOfCity,countCoordinates , countLengths ,countParcels} = req.body;

      let coordinates = {};
      
      for(let i = 0; i < parseInt(countCoordinates); i++){
        coordinates[`D${i+1}`] = [parseFloat(req.body[`long${i}`]),parseFloat(req.body[`lat${i}`])]
      }

      let lengths = {};

      for(let i = 0; i < parseInt(countLengths); i++){
        if(i === countLengths - 1){
          lengths[`C${i+1}${countLengths-i}`] = parseFloat(req.body[`length${i}`])
        }else{
          lengths[`C${i+1}${i+2}`] = parseFloat(req.body[`length${i}`])
        }
      }

      let parcels = []
      for(let i = 0; i < countParcels; i++){
        parcels.push(parseInt(req.body[`parcel${i}`]))
      }
      // console.log(thuasodat,tobandoso,dientich,hinhthucsudung,mucdichsudung,
      //   thoihansudung,nguongocsudung,url,landOfCity,countCoordinates ,
      //   countLengths ,countParcels)
      // console.log(parcels)

      let date_ob = new Date();
      let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
      let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
      let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
      let thoigiandangky = `${time}-${newDate}`;

      const userId = req.session.user.userId;
      const owner = req.session.user.fullname;
      const idCard = req.session.user.idCard;

      await invokeLandOne(userId,owner,thuasodat,tobandoso,parcels,dientich, JSON.stringify(coordinates),
      JSON.stringify(lengths),
      hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,thoigiandangky,url,landOfCity);
      await saveMessage(userId,"Bạn đã thêm một mảnh đất mới")
      req.flash('success',"Đã thêm mới thành công")
      res.redirect('/');
    },

    async handleAddAssetCo(req,res){
      const {thuasodat,tobandoso,dientich,hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,url,landOfCity,countOwner, countCoordinates, countLengths, countParcels} = req.body;

      let listOwner = [req.session.user.userId];
      let listNameOwner = [];
      for(let i = 0; i < countOwner; i++){
        listOwner.push(req.body[`owner${i}`]);
      }

      for(let i = 0; i < listOwner.length;i++){
        let listUser = await getUser(listOwner[i]);
        listNameOwner.push(listUser[0].fullname)
      }

      let coordinates = {};
      
      for(let i = 0; i < countCoordinates; i++){
        coordinates[`D${i+1}`] = [parseFloat(req.body[`long${i}`]),parseFloat(req.body[`lat${i}`])]
      }

      let lengths = {};

      for(let i = 0; i < countLengths; i++){
        if(i === countLengths - 1){
          lengths[`C${i+1}${countLengths-i}`] = parseFloat(req.body[`length${i}`])
        }else{
          lengths[`C${i+1}${i+2}`] = parseFloat(req.body[`length${i}`])
        }
      }

      let parcels = []
      for(let i = 0; i < countParcels; i++){
        parcels.push(req.body[`parcel${i}`])
      }


      let date_ob = new Date();
      let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
      let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
      let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
      let thoigiandangky = `${time}-${newDate}`;
      const userId = req.session.user.userId;
   
      try {
        await invokeLandCo(userId,listOwner,listNameOwner,thuasodat,tobandoso,parcels,dientich,JSON.stringify(coordinates),
        JSON.stringify(lengths),
        hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,thoigiandangky,url,landOfCity);
        for(let i = 0; i < listOwner.length; i++){
          await saveMessage(listOwner[i],"Bạn đã sở một mảnh đất mới gồm nhiều người sở hữu "+listOwner.join('-'))
        }

        req.flash('success',"Đã thêm mới thành công")
        res.redirect('/');
      } catch (error) {
        console.log("Add Failed")
        req.flash('error',"Thêm đất thất bại ")
        res.redirect('/');
      }

    },

    async transferLand(req,res){
      const key = req.params.key;
      req.session.key = key;
      res.render('transferLand',{key: key,userId:req.session.user.userId})
    },

    async handleTransferLand(req,res){
      const {owner0} = req.body;
      let userId = req.session.user.userId;
      const key = req.session.key;
      console.log(owner0)
      console.log(key)
      console.log(userId)
      let landString = await query(key,userId)
      let land = JSON.parse(landString);
      console.log(land);

      try {
        // check Land is exist user
          let landString = await query(key,userId)
          let land = JSON.parse(landString);
          if(typeof land.UserId != "object"){

            if(land.UserId == userId){

              let date_ob = new Date();
              let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
              let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
              let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
              let thoigiandangky = `${time}-${newDate}`;

              await createTransfer(key,userId,owner0,thoigiandangky)
              await updateLand(userId,key,"Đang chuyển1")
              await saveMessage(owner0,`Bạn nhận được đất do người sở hữu ${userId} chuyển cho bạn`)
              await saveMessage(userId,`Bạn đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${owner0}`)
            
              req.flash("success",`Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${owner0}`)
              return res.redirect('/')
            }else{
              req.flash("success", `Người dùng ${userId} không sở hữu mảnh đất ${key}`)
              return res.redirect('/')
            }

          }else{
            if(land.UserId.includes(userId)){
              console.log("DA VAO DAY ROIIIIIIIIIIIIIIIIIIIIIIIIIIIIi : "+land.UserId)
              let date_ob = new Date();
              let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
              let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
              let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
              let thoigiandangky = `${time}-${newDate}`;
              
              await createTransferCoToOne(key,userId,land.UserId,owner0,thoigiandangky)
              await updateLand(userId,key,"Đang chuyển1")

              for(let i = 0; i < land.UserId.length;i++){
                await saveMessage(land.UserId[i],`${land.UserId.join('-')} đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${owner0}`)
              }
              await saveMessage(owner0,`Bạn nhận được yêu cầu nhận đất có mã số  ${key} từ người sở hữu ${land.UserId.join('-')}`)

              console.log("Da toi redirectttttttttttttttttttttttttttttttttt")
              req.flash("success",`Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${owner0}`)
              return res.redirect('/')
            }else{
              req.flash("success", `Người dùng ${userId} không sở hữu mảnh đất ${key}`)
              return res.redirect('/')
            }
            

          }
       
      } catch (error) {
        req.flash("owner0",owner0)
        req.flash("error","Lỗi chuyển nhượng")
        res.redirect(`/transferLand/${key}`)
      }
      
    },

    async handleTransferLandCoToCo(req,res){
      const {countOwner} = req.body;
      let listOwner = []
      for(let i = 0 ; i < countOwner; i++){
        listOwner.push(req.body[`owner${i}`])
      }
      let userId = req.session.user.userId;
      const key = req.session.key;
      console.log(`key ${key}`)
      console.log(`user ${userId}`)


      try {
        // check Land is exist user
          let landString = await query(key,userId)
          let land = JSON.parse(landString);
          if(typeof land.UserId != "object"){
            if(land.UserId == userId){

              let date_ob = new Date();
              let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
              let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
              let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
              let thoigiandangky = `${time}-${newDate}`;
              

              await createTransferOneToCo(key,userId,userId,listOwner,thoigiandangky)
              await updateLand(userId,key,"Đang chuyển1")
              await saveMessage(userId,`Bạn đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${listOwner.join('-')}`)
              for(let i = 0; i < listOwner.length;i++){
                await saveMessage(listOwner[i],`Bạn nhận được đất do người sở hữu ${userId} chuyển cho bạn`)
              }
              req.flash("success",`Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${listOwner.join('-')}`)
              res.redirect('/')
            }else{
              req.flash("success", `Người dùng ${userId} không sở hữu mảnh đất ${key}`)
              res.redirect('/')
            }
          }else{
            if(land.UserId.includes(userId)){

              let date_ob = new Date();
              let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
              let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
              let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
              let thoigiandangky = `${time}-${newDate}`;

              await createTransferCoToCo(key,userId,land.UserId,listOwner,thoigiandangky)
              await updateLand(userId,key,"Đang chuyển1")
              for(let i = 0; i < land.UserId.length;i++){
                await saveMessage(land.UserId[i],`${land.UserId.join('-')} đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${listOwner.join('-')}`)
              }
              for(let i = 0; i < listOwner.length;i++){
                await saveMessage(listOwner[i],`Bạn nhận được đất do người sở hữu ${land.UserId.join('-')} chuyển cho bạn`)
              }

              req.flash("success",`Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${listOwner.join('-')}`)
              res.redirect('/')
            }else{
              req.flash("success", `Người dùng ${userId} không sở hữu mảnh đất ${key}`)
              res.redirect('/')
            }
           
          }

      } catch (error) {
        req.flash("error","Lỗi chuyển nhượng")
        res.redirect(`/transferLand/${key}`)
      }
      
    },

    async logoutUser(req, res) {
      req.session.destroy();
      return res.redirect("/login");
    },

    async processTransfer(req,res){
      const {keyTransfer, confirmed, position} = req.body;
      console.log(`keytransfer ${keyTransfer}`)
      let dataString = await queryTransferOne(req.session.user.userId,keyTransfer);
      let data = JSON.parse(dataString)
      console.log(`confirmed : ${typeof confirmed}`)
      // console.log(`confirmed2 : ${position}`)

      // res.send("OK")
      return res.render("processTransfer",{dataProcessTransfer: data,keyTransfer:keyTransfer,position:position, confirmed:confirmed})

    },

    async receiveLand(req,res){
      const transString = await queryAllTransferReceiver(req.session.user.userId);
      const result = JSON.parse(transString);
      return res.render("receiveLand",{result: result, success:req.flash("success")})
    },

    async transferLandOwner(req,res){
      const transString = await queryAllTransferOwner(req.session.user.userId);
      // const transStringCo = await queryAllTransferOwnerCo(req.session.user.userId);
      const result = JSON.parse(transString);
      return res.render("transferedLand",{result: result, success:req.flash("success")})
    },

    async handleConfirmFromReceiver(req,res){
      const {key,userIdFromTransfer} = req.body;
      console.log(key)
      console.log(userIdFromTransfer)
      try {

        let date_ob = new Date();
        let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
        let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
        let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
        let thoigiandangky = `${time}-${newDate}`;

        await updateTransfer(req.session.user.userId,key,req.session.user.role,thoigiandangky);
        await saveMessage(req.session.user.userId,"Bạn đã nhận đất thành công")
        await saveMessage(userIdFromTransfer,`Người dùng ${req.session.user.userId} đã nhận mã đất ${key}`)
        req.flash("success","Bạn đã xác nhận nhận đất thành công")
        res.redirect('/receiveLand');
      } catch (error) {
        req.flash("error","Có lỗi xảy ra chưa nhận đất thành công")
        res.redirect('/receiveLand');
      }
      
    },

    async handleConfirmFromTransferCo(req,res){
      const {key} = req.body;
      console.log(`handle  transfer co : ${key}`)
      const userId = req.session.user.userId;
      try {

        await updateTransferCo(userId,key,"from");
        let transferString = await queryTransferOne(userId,key);
        let transfer = JSON.parse(transferString);
        await saveMessage(userId,`Bạn đã xác nhận chuyển đất { ${transfer.Land} } thành công`)
        for(let i = 0; i < Object.keys(transfer.From).length; i++){
          await saveMessage(Object.keys(a)[i],`Người dùng ${userId} đã xác nhận chuyển mã đất ${transfer.Land}`)
        }
        req.flash("success","Bạn đã xác nhận nhận đất thành công")
        res.redirect('/transferLandOwner');
      } catch (error) {
        req.flash("error","Có lỗi xảy ra chưa nhận đất thành công")
        res.redirect('/transferLandOwner');
      }
      
    },

    async handleConfirmFromReceiverCo(req,res){
      const {keyTransfer} = req.body;
      const userId = req.session.user.userId;
      console.log(keyTransfer)
      try {
        await updateTransferCo(userId,keyTransfer,"to");
        let transferString = await queryTransferOne(userId,keyTransfer);
        let transfer = JSON.parse(transferString);
        await saveMessage(userId,"Bạn đã nhận đất thành công")
        for(let i = 0; i < Object.keys(transfer.From).length; i++){
          await saveMessage(Object.keys(a)[i],`Người dùng ${userId} đã xác nhận chuyển mã đất ${transfer.Land}`)
        }
     
        req.flash("success","Bạn đã xác nhận nhận đất thành công")
        res.redirect('/receiveLand');
      } catch (error) {
        req.flash("error","Có lỗi xảy ra chưa nhận đất thành công")
        res.redirect('/receiveLand');
      }
      
    },

    async updateStatusLandAdmin(req,res){
      const {key,status,userId} = req.body;
      console.log(key);
      console.log(status);
      try {
          await updateLand(req.session.user.userId,key,status)
          req.flash("success",`Cập nhật thành công mã đất ${key} của người sở hữu ${userId} với trạng thái mới ${status}`)
          await saveMessage(userId, `Đã duyệt đất có mã số ${key} đã được duyệt thành công`)
          await saveMessage(req.session.user.userId, `Đất có mã số ${key} đã được duyệt thành công`)
          res.redirect("/")
      } catch (error) {
          req.flash("error",`Cập nhật thất bại`)
          res.redirect("/")
      }
    
    },

    // admin xac nhan chuyen dat
    async confirmTransferAdmin(req,res){
      const {key} = req.body;
      const userId = req.session.user.userId;
      console.log(`key++++++++++++++++++++++: ${key}`)

      try {
        let transferString = await queryTransferOne(userId,key)
        let transfer = JSON.parse(transferString)
        let oldUserId = transfer.From;
        let newUserId = transfer.To;
        let land = transfer.Land;
        let listNameOwner = [];

        let date_ob = new Date();
        let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
        let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
        let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
        let thoigiandangky = `${time}-${newDate}`;

        if(typeof newUserId == 'object'){

          let listNewUserHandle = []
          for(let el of newUserId){
            listNewUserHandle.push(Object.keys(el)[0])
          }

          for(let i = 0; i < listNewUserHandle.length;i++){
            let listNewUser = await getUser(listNewUserHandle[i]); // get fullname from firebase;
            console.log(`toi day roi : ${listNewUser}`)
            console.log(`toi day roi2 : ${newUserId[i]}`)

            listNameOwner.push(listNewUser[0].fullname);
          }


          await changeLandOwner(land,userId,oldUserId,listNewUserHandle,listNameOwner,thoigiandangky)
          await updateLand(req.session.user.userId,land,"Đã duyệt")

          await updateTransfer(req.session.user.userId,key,req.session.user.role,thoigiandangky)


          saveMessageTransferLandSuccessLoop(oldUserId,listNewUserHandle,land)

          req.flash("success","Xác nhận chuyển đất "+key+" thành công")
          res.redirect('/requestAllTransferLand')
        }else{
          console.log("CHUYEN 1 NGUOI +++++++++++++++++++++++++++++++++++++++++++++")
          let listNewUser = await getUser(newUserId); // get fullname from firebase;
          let owner = listNewUser[0].fullname;

          let date_ob = new Date();
          let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
          let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
          let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
          let thoigiandangky = `${time}-${newDate}`;

          let listOldUserHandle = []
          for(let el of oldUserId){
            listOldUserHandle.push(Object.keys(el)[0])
          }

          await changeLandOwner(land,userId,listOldUserHandle,newUserId,owner,thoigiandangky)
          await updateLand(userId,land,"Đã duyệt")
          await updateTransfer(req.session.user.userId,key,req.session.user.role,thoigiandangky)

          if(typeof oldUserId == 'object'){
            for(let i = 0 ; i < oldUserId.length; i++){
              await saveMessage(oldUserId[i], `Admin đã xác nhận đất có mã số ${land} đã được chuyển thành công cho người sở hữu ${newUserId}`)
            }
            await saveMessage(newUserId, `Admin đã xác nhận ! Bạn đã nhận được đất có mã ${land}} `)

          }else{
            await saveMessage(oldUserId, `Admin đã xác nhận đất có mã số ${land} đã được chuyển thành công cho người sở hữu ${newUserId}`)
            await saveMessage(newUserId, `Admin đã xác nhận ! Bạn đã nhận được đất có mã ${land}} `)
          }

          req.flash("success","Xác nhận chuyển đất "+key+" thành công")
          res.redirect('/requestAllTransferLand')
          res.send("Chuyen cho 1 nguoi nhan")
        }

        // res.redirect('/requestAllTransferLand')
      } catch (error) {
        console.log(`ERROR : ${error}`);
        req.flash("success","Có lỗi xảy ra")
        res.redirect('/requestAllTransferLand')
      }
     
    },

    async cancelTransferLane(req,res){
      try {
        const {keyLand, keyTransfer, receiver} = req.body;
        await cancleTransferFromUser(keyTransfer,req.session.user.userId,keyLand);
        await updateLand(req.session.user.userId,keyLand,"Đã duyệt")
        await saveMessage(req.session.user.userId,`Bạn đã hủy chuyển nhượng mã đất ${keyLand} thành công`)
        await saveMessage(receiver,`Người chuyển mã đất ${keyLand} đã hủy giao dịch`)
        req.flash('success',`Bạn đã hủy chuyển mã đất ${keyLand} cho người nhận ${receiver} thành công`)
        res.redirect('/')
      } catch (error) {
        console.log(`ERROR : ${error}`)
        req.flash('success',`Hủy chuyển không thành công`)
        res.redirect('/')
      }

    },

    //modify land

    async modifyUI(req,res){
      const key = req.params.key;
      const userId = req.session.user.userId;
      let landString = await query(key,userId);
      let land = JSON.parse(landString)

      return res.render("modifyLand",{land:land,key:key})
    },

    async handleModifyLand(req,res){
      const {key, userIdOwner , owner , 
        thuasodat,tobandoso,
        dientich,hinhthucsudung,mucdichsudung,thoihansudung,
        nguongocsudung,url,landOfCity,countCoordinates,countLengths,
        countParcels , lengthsOld, coordinatesOld, countOwner} = req.body;

        console.log("ALL : "+key, userIdOwner , owner , 
        thuasodat,tobandoso,
        dientich,hinhthucsudung,mucdichsudung,thoihansudung,
        nguongocsudung,url,landOfCity,countCoordinates,
        countLengths,countParcels, lengthsOld, coordinatesOld)


        let coordinatesNew;
        let lengthsNew;
        let userIdNew;

        let coordinates = {};
        let lengths = {};
        let parcels = []

        if(countCoordinates != ""){
          for(let i = 0; i < parseInt(countCoordinates); i++){
            coordinates[`D${i+1}`] = [parseFloat(req.body[`long${i}`]),parseFloat(req.body[`lat${i}`])]
          }
          coordinatesNew = JSON.stringify(coordinates);
    
        }else{
          coordinatesNew = coordinatesOld
        }

        console.log("COOR: "+coordinatesNew)


        for(let i = 0; i < parseInt(countParcels); i++){
          parcels.push(parseInt(req.body[`parcel${i}`]))
        }


        if(countLengths != ""){
          console.log("COUNT LENGTH : "+countLengths)
          for(let i = 0; i < countLengths; i++){
            if(i === countLengths - 1){
              lengths[`C${i+1}${countLengths-i}`] = parseFloat(req.body[`length${i}`])
            }else{
              lengths[`C${i+1}${i+2}`] = parseFloat(req.body[`length${i}`])
            }
          }
          lengthsNew = JSON.stringify(lengths);
        }else{
          lengthsNew = lengthsOld
        }


        let listOwner = [];
        let listNameOwner = [];

        if(countOwner !== undefined){
           listOwner = [req.session.user.userId];
           listNameOwner = [];
          for(let i = 0; i < countOwner; i++){
            listOwner.push(req.body[`owner${i}`]);
          }
    
          for(let i = 0; i < listOwner.length;i++){
            let listUser = await getUser(listOwner[i]);
            listNameOwner.push(listUser[0].fullname)
          }
        }else{
          listOwner = userIdOwner;
          listNameOwner = owner;
        }
    


      let userId = req.session.user.userId;

      console.log("ALLLLLL: "+userId,key, listOwner , listNameOwner ,thuasodat,tobandoso, 
      parcels,dientich,coordinatesNew,lengthsNew,
      hinhthucsudung,mucdichsudung,
      thoihansudung,nguongocsudung,url,landOfCity)
      console.log("GOOD " +  lengthsNew)
      console.log("GOOD2 " + typeof lengthsNew)

      try {
        await modifyLand(userId,key, listOwner , listNameOwner ,thuasodat,tobandoso, 
          parcels,dientich,coordinatesNew,lengthsNew,
          hinhthucsudung,mucdichsudung,
          thoihansudung,nguongocsudung,url,landOfCity)
        
        req.flash("success","Bạn đẫ thay đổi thông tin đất có mã "+key)
        return res.redirect('/')
      } catch (error) {
        console.log("ERROR : "+error)
      }


    }

  };
}

module.exports = homeController;







