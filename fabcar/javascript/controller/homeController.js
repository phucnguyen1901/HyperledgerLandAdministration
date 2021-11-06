
const queryAllLane = require("../queryAllLands")
const query = require("../queryLand")
const queryTransfer = require("../queryTransfer")
const invoke = require('../invoke')
// const transfer = require('../transferLand')
const createTransfer = require('../inkvode_transfer')
const {saveMessage,getMessage , getUser} = require('./saveUser')

const updateLane = require('../updateLane')
const checkLaneOwner = require('../checkLaneOwner')

const changeLandOwner = require('../confirmTransferLand')

const queryAllTransferReceiver = require('../queryAllTransferReceiver')
const queryAllTransfer = require('../queryAllTransfer')


const updateTransfer = require('../updateTransfer')

const {register, auth} = require('../register')
const { render } = require("ejs")

function homeController() {
  return {
    async index(req, res) {
        try {
            const menu = await queryAllLane(req.session.user.userId,req.session.user.fullname,req.session.user.idCard,req.session.user.role);
            const obj = JSON.parse(menu);
            return res.render("home",{ menu: obj , success: req.flash('success')});
            // return res.render("home",{ menu: obj , message: req.flash('message')});
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

        return res.render("detail",{ detail: obj, key: key, requestPerson: 'transferUser'});

    },

    async detailReceive(req,res){
      const {key, userIdTransfer} = req.params;
      console.log(`key :`+key)
      console.log(`userID :`+userIdTransfer)
      try {
        let laneString = await queryTransfer(userIdTransfer,key);
        const lane = JSON.parse(laneString);
        if(lane[0].value.To == req.session.user.userId){
          const detail = await query(key,userIdTransfer);
          const obj = JSON.parse(detail);
          return res.render("detail",{ detail: obj, key: lane[0].key, requestPerson: 'receiveUser'});
        }

      } catch (error) {
        console.log("Loi roi"+error)
        req.flash("error","Xảy ra lỗi")
        return res.redirect("/receiveLand")
      }

    },

    async demoSubmit(req,res){
      try {
        const toadocacdinh = '{"D1": [406836.70,1183891.04],"D2": [406836.75,1183891.44],"D3": [406836.80,1183891.37],"D4": [406836.79,1183891.40]}';
        const chieudaicaccanh = '{"C12": 20.5, "C23": 1.12, "C34":7.53, "C41" :15.5}';
        await invoke('LANE5','Phuc Nguyen',"Nam",'12312312','Ca Mau',192,1,[123,124,125],1200,toadocacdinh,
        chieudaicaccanh,
        "Chung","Mua ban","vinh vien","Mua cua nha nuoc","18/9/2025");
        // res.send('OK');
        res.redirect('http://localhost:3000/');
      } catch (error) {
         res.send(error);
      }
    },

    async addAsset(req,res){
      res.render("addAsset")
    },


    async handleAddAsset(req,res){
      const {hktt,thuasodat,tobandoso,dientich,hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung} = req.body;
      let date_ob = new Date();
      let monthNow = date_ob.getMonth() < 10 ? `0${date_ob.getMonth()}` : `${date_ob.getMonth()}`;
      let newDate = `${date_ob.getDay()}/${monthNow}/${date_ob.getFullYear()}`;
      let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;
      let thoigiandangky = `${time} - ${newDate}`;
      const userId = req.session.user.userId;
      const owner = req.session.user.fullname;
      const idCard = req.session.user.idCard;
      const toadocacdinh = '{"D1": [406836.70,1183891.04],"D2": [406836.75,1183891.44],"D3": [406836.80,1183891.37],"D4": [406836.79,1183891.40]}';
      const chieudaicaccanh = '{"C12": 20.5, "C23": 1.12, "C34":7.53, "C41" :15.5}';
      await invoke(userId,owner,idCard,hktt,thuasodat,tobandoso,[123,124,125],dientich,"{}",
      "{}",
      hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,thoigiandangky);
      await saveMessage(userId,"Bạn đã thêm một mảnh đất mới")
      req.flash('success',"Đã thêm mới thành công")
      res.redirect('/');
    },

    async transferLand(req,res){
      const key = req.params.key;
      req.session.key = key;
      res.render('transferLand',{key: key})
    },

    async handleTransferLand(req,res){
      const {email} = req.body;
      let userId = req.session.user.userId;
      const key = req.session.key;
      console.log(email)
      console.log(key)
      console.log(userId)

      try {
        // check lane is exist user
        let check = await checkLaneOwner(key,userId)
        if(check){
          await createTransfer(key,userId,email)
          await updateLane(userId,key,"Đang chuyển")
          await saveMessage(email,`Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${email}`)
          req.flash("success",`Đã gửi yêu cầu chuyển quyền sở hữu đất có mã ${key} cho người sở hữu ${email}`)
          res.redirect('/')
        }else{
          req.flash("success", `Người dùng ${userId} không sở hữu mảnh đất ${key}`)
          res.redirect('/')
        }
       
      } catch (error) {
        req.flash("email",email)
        req.flash("error","Lỗi chuyển nhượng")
        res.redirect(`/transferLand/${key}`)
      }
      
    },

    async logoutUser(req, res) {
      req.session.destroy();
      return res.redirect("/login");
    },

    async processTransfer(req,res){
      const key = req.params.key;
      let dataString = await queryTransfer(req.session.user.userId,key);
      let data = JSON.parse(dataString)

      return res.render("processTransfer",{dataProcessTransfer: data[0], length:data.length})

    },

    async receiveLand(req,res){
      const transString = await queryAllTransferReceiver(req.session.user.userId);
      const result = JSON.parse(transString);
      return res.render("receiveLand",{result: result, success:req.flash("success")})
    },

    async handleConfirmFromReceiver(req,res){
      const key = req.params.key;
      console.log(key)
      try {
        console.log(`role :${req.session.user.role}`)
        console.log(`role1 :${key}`)
        console.log(`role2 :${req.session.user.userId}`)
        await updateTransfer(req.session.user.userId,key,req.session.user.role);
        req.flash("success","Bạn đã xác nhận nhận đất thành công")
        res.redirect('/receiveLand');
      } catch (error) {
        req.flash("error","Có lỗi xảy ra chưa nhận đất thành công")
        res.redirect('/receiveLand');
      }
      
    },

    async updateStatusLaneAdmin(req,res){
      const {key,status ,userId} = req.body;
      console.log(key);
      console.log(status);
      try {
          await updateLane(userId,key,status)
          req.flash("success",`Cập nhật thành công mã đất ${key} của người sở hữu ${userId} với trạng thái mới ${status}`)
          res.redirect("/")
      } catch (error) {
          req.flash("success",`Cập nhật thất bại`)
          res.redirect("/")
      }
    
    },

    async confirmTransferAdmin(req,res){
      const {key,userIdOld, userIdNew ,lane} = req.body;
      try {
        let newUser = await getUser(userIdNew);
        let newFullname = newUser[0].fullname;
        let newIdCard = newUser[0].idCard;

        await changeLandOwner(lane,userIdOld,userIdNew,newIdCard,newFullname)
        await updateLane(req.session.user.userId,lane,"Đã duyệt")
        await updateTransfer(req.session.user.userId,key,req.session.user.role)
        req.flash("success","Xác nhận chuyển đất "+key+" thành công")
        res.redirect('/requestAllTransferLane')
      } catch (error) {
        console.log(`ERROR : ${error}`);
        req.flash("success","Có lỗi xảy ra")
        res.redirect('/requestAllTransferLane')
      }
     
    }

  };
}

module.exports = homeController;







