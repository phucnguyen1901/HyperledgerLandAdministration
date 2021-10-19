


const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');


function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}




// async function queryAllLands(){
//     try {

//         const contract = await 
        
//         const result = await contract.evaluateTransaction('queryAllLands');
//         console.log(`Transaction has been evaluated, result is: ${prettyJSONString(result.toString())}`);

//         // Disconnect from the gateway.
//         await gateway.disconnect();
//         return result.toString();
        
//     } catch (error) {
        
//     }
// }











