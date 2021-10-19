

import { getFirestore , collection, getDocs, addDoc} from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js'

import app from '/js/config.js';

const db = getFirestore(app);

async function saveUser(){
    const numberPhone = document.getElementById("numberPhone").value;
    const email = document.getElementById("email").value;
    const fullname = document.getElementById("fullname").value;
    const idCard = document.getElementById("idCard").value

    console.log(numberPhone)
    console.log(email)
    console.log(fullname)
    console.log(idCard)

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
async function getCities(db) {
  const citiesCol = collection(db, 'users');
  const citySnapshot = await getDocs(citiesCol);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  console.log(cityList);
}





