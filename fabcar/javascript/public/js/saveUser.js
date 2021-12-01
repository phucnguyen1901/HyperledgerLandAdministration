

import { getFirestore , collection, getDocs, setDoc, addDoc, query, where , doc, updateDoc , serverTimestamp} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js'

import app from '/js/config.js';

const db = getFirestore(app);

export default async function saveUser(fullname,numberPhone,idCard){

     try {
        const docRef = await addDoc(collection(db, "users"), {
            fullname: fullname,
            numberPhone:numberPhone,
            idCard: idCard,
            role:"user"
        });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

}



// Get a list of cities from your database
export async function getUser(userId) {
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

async function getKeyWith(userId) {
  console.log("Get key")
  const q = query(collection(db, "messages"), where("userId", "==", userId));
  const citySnapshot = await getDocs(q);
  if(citySnapshot.docs.length > 0){
    const cityList = citySnapshot.docs.filter((doc) => {
      return doc.data().Seen == false;
    });
    const resultList = cityList.map((element) => {
      return element.id;
    })
    console.log(`list : ${typeof resultList}`);
    return resultList;
  }else{
      console.log("Login Failed")
      return [];
  }
}




export async function updateMessage(userId){
    try {
        const listMessage = await getKeyWith(userId)

        if(listMessage.length > 0){
          
           for(var key of listMessage){
              await updateDoc(doc(db,"messages",key),{Seen: true})
              console.log("update success");
            }

        }else{
          console.log("Khong co tin nhan moi")

        }
        
   } catch (e) {
        console.error("Error adding document: ", e);
    }

}

