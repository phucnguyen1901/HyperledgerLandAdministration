
const queryAll = require("../queryAllLands")
const query = require("../queryLand")
const invoke = require('../invoke')
const transfer = require('../transferLand')
const {saveMessage,getMessage} = require('./saveUser')

const queryMessage = require("../queryMessage")


const {register, auth} = require('../register')
const { render } = require("ejs")

function homeController() {
  return {
    async index(req, res) {
        try {
            const menu = await queryAll(req.session.user.userId,req.session.user.fullname,req.session.user.idCard,req.session.user.role);
           
            const obj = JSON.parse(menu);
            return res.render("home",{ menu: obj , success: req.flash('success')});
            // return res.render("home",{ menu: obj , message: req.flash('message')});
        } catch (error) {
          console.log("Login khong thanh cong : "+error)
          req.flash('message',"Sai email hoặc mật khẩu")
          return res.redirect('/login')
        }

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

        return res.render("detail",{ detail: obj, key: key});

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
      const {hktt,thuasodat,tobandoso,dientich,hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,thoigiandangky} = req.body;
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
      const {email,idCard,owner} = req.body;
      let userId = req.session.user.userId;
      const key = req.session.key;
      console.log(key)
      console.log(owner);

      try {
        await transfer(key,userId,email,idCard,owner)
        req.flash("success",`Đã chuyển thành công quyền sở hữu đất có mã ${key} cho người sở hữu ${owner}`)
        res.redirect('/')
      } catch (error) {
        req.flash("owner",owner)
        req.flash("idCard",idCard)
        req.flash("email",email)
        req.flash("error","Lỗi chuyển nhượng")
        res.redirect(`/transferLand/${key}`)
      }
    

    },

    async logoutUser(req, res) {
      req.session.destroy();
      return res.redirect("/login");
    }

  };
}

module.exports = homeController;







