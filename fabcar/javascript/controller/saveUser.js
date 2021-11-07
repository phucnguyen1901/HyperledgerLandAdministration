

const { getFirestore , collection, getDocs, setDoc, addDoc, query, where, serverTimestamp, orderBy} = require("firebase/firestore")
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

async function saveMessage(userId,message) {
    let date_ob = new Date();
    let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
    let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
    let time = `${date_ob.getHours()}:${date_ob.getMinutes()}:${date_ob.getSeconds()}`;

    try {
        const docRef = await addDoc(collection(db, "messages"), {
            userId:userId,
            Message: message,
            Date: newDate,
            Time: time,
            Seen: false,
            timestamp:serverTimestamp()
        });
            console.log("Message written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
    }

}


async function getMessage(userId) {
  console.log("Get messages")
  const q = query(collection(db, "messages"), where("userId", "==", userId),orderBy("timestamp","desc"));
  const citySnapshot = await getDocs(q);
  if(citySnapshot.docs.length > 0){
    const cityList = citySnapshot.docs.map(doc => doc.data());
    console.log(cityList);
    return cityList;
  }else{
      console.log("get message Failed")
      return [];
  }
}


async function updateMessage(userId){

     try {
        const docRef = await setDoc(collection(db, "messages"), {
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




module.exports = {saveUser,getUser,saveMessage, getMessage}













