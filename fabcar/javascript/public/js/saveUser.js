

import { getFirestore , collection, getDocs, addDoc, query, where} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js'

import app from '/js/config.js';

const db = getFirestore(app);

export default async function saveUser(email,fullname,numberPhone,idCard){

     try {
        const docRef = await addDoc(collection(db, "users"), {
            Email: email,
            FullName: fullname,
            NumberPhone:numberPhone,
            idCard: idCard
        });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

}



// Get a list of cities from your database
export async function getUser(idCard) {
  console.log("Get user")
  const q = query(collection(db, "users"), where("idCard", "==", idCard));
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





