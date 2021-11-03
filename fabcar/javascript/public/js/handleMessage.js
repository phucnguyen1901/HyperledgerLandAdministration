

    import { updateMessage } from '/js/saveUser.js';

    var checkShowMessage = true;

    document.getElementById("notification").addEventListener('click',async function(){
           
            const count = document.getElementById("MessageLength").value;
            const userId = document.getElementById("UserId").value;
            if(count > 0){
                document.getElementById("countMessage").style.display = "none";
            }

            if(checkShowMessage){
                document.getElementById("message").style.display = "block";
                checkShowMessage = false;
            }else{
                document.getElementById("message").style.display = "none";
                checkShowMessage = true;
            }
            await updateMessage(userId);
      
    })













