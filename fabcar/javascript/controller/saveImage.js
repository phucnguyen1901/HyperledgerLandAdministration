
const app = require('./config')
var fs = require('fs');

const {getStorage, getDownloadURL, uploadBytesResumable,ref,uploadBytes,uploadString} = require('firebase/storage')




function uploadImage(file){
    const storage = getStorage(app);
    const storageRef = ref(storage, 'images/rivers.png');
    // const uploadTask = uploadBytesResumable(storageRef, file);

    uploadBytes(storageRef, file).then((snapshot) => {
      console.log('Uploaded a blob or file!');
    });

}


module.exports = uploadImage;

