
const queryAll = require("../queryAllLands")
const query = require("../queryLand")
const invoke = require('../invoke')
const enrollAdmin = require('../enrollAdmin')
const registerUser = require('../registerUser')
const registerUser2 = require('../registerUser2')

const {register, auth} = require('../register')

function homeController() {
  return {
    async index(req, res) {
        const organizationsCA = ['ca.org1.example.com','ca.org2.example.com'];
        const mspOrg = ['Org1MSP','Org2MSP'];
        const affiliations = ['org1.department1','org2.department2'];
        const userId = "kobao";
        // await enrollAdmin();
        // await registerUser2(user);
        // const menu = await queryAll(user);
        // const obj = JSON.parse(menu);
        // console.log(obj);
        // res.render("home",{ menu: obj });
        // await register(userId,mspOrg[0],organizationsCA[0],affiliations[0]),
        // await auth(userId)
        // res.send("OK");
        
        res.render("home")
    },

    async detail(req,res){
        const params = req.params.key;
        const notFound = 'Not Found';

        const detail = await query(params);
        const obj = JSON.parse(detail);
        console.dir(obj)

        // const m = JSON.parse(chieudaicaccanh)
        // console.log(typeof m)
        // console.log(obj.ChieuDaiCacCanh)
        // console.dir(detail)
        // const chieudaicaccanh = JSON.parse(m);
        // console.log(m.12])
        
        if(detail == 'Not found'){
          return res.render("detail",{ detail: notFound });
        }

        return res.render("detail",{ detail: obj});

    },


    async handleSubmit(req,res){
      const {owner,idCard} = req.body;
      console.log(req.body)
      console.log(owner)
      console.log(idCard)
      res.redirect('/');
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
    }




  };
}

module.exports = homeController;







