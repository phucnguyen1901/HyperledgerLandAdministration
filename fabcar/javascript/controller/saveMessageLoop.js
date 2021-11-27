const { saveMessage } = require("./saveUser");



async function saveMessageTransferLandSuccessLoop(listOld,listNew,keyLand){

    if(typeof listOld == 'object'){
        let listNewUserHandle = []
        for(let el of newUserId){
          listNewUserHandle.push(Object.keys(el)[0])
        }
        for(let i = 0; i < listNewUserHandle.length; i++){
            await saveMessage(listNewUserHandle[i], `Admin đã xác nhận đất có mã số ${keyLand} đã được chuyển thành công cho người sở hữu ${listNew.join('-')}`)
        }
    }else{
        await saveMessage(listOld, `Admin đã xác nhận đất có mã số ${keyLand} đã được chuyển thành công cho người sở hữu ${listNewUserHandle.join('-')}`)

    }

    for(let i = 0; i < listNew.length; i++){
        await saveMessage(listNew[i], `Admin đã xác nhận ! Bạn đã nhận được đất có mã ${keyLand}} `)
    }

}



module.exports = saveMessageTransferLandSuccessLoop



