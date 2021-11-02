

const { getFirestore , collection, getDocs, addDoc, query, where} = require("firebase/firestore")
const app = require('./config')

const db = getFirestore(app);

async function saveUser(userId,fullname,numberPhone,idCard,password){

     try {
        const docRef = await addDoc(collection(db, "users"), {
            userId:userId,
            fullname: fullname,
            numberPhone:numberPhone,
            idCard: idCard,
            password:password,
            role:"user"
        });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

}



// Get a list of cities from your database
async function getUser(userId) {
  console.log("Get user")
  const q = query(collection(db, "users"), where("userId", "==", userId));
  const citySnapshot = await getDocs(q);
  if(citySnapshot.docs.length > 0){
    const cityList = citySnapshot.docs.map(doc => doc.data());
    console.log(cityList);
    return cityList;
  }else{
      console.log("Login Failed")
      return [];
  }
}

async function loginUser(email,password) {
  console.log("Get user")
  const q = query(collection(db, "users"), where("userId", "==", email), where("password", "==", password));
  const citySnapshot = await getDocs(q);
  if(citySnapshot.docs.length > 0){
    const cityList = citySnapshot.docs.map(doc => doc.data());
    console.log(cityList);
    return cityList;
  }else{
      console.log("Login Failed")
      return [];
  }
}


module.exports = {saveUser,getUser,loginUser}













