

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'fabcar';
// const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
// const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function register(userId,mspOrg,orgCA,Affi){
    	const ccp = buildCCPOrg1();

		// build an instance of the fabric ca services client based on
		// the information in the network configuration
		const caClient = buildCAClient(FabricCAServices, ccp, orgCA);

		// setup the wallet to hold the credentials of the application user
		const wallet = await buildWallet(Wallets, walletPath);

		// in a real application this would be done on an administrative flow, and only once
		await enrollAdmin(caClient, wallet, mspOrg);

		// in a real application this would be done only when a new user was required to be added
		// and would be part of an administrative flow
		await registerAndEnrollUser(caClient, wallet, mspOrg, userId, Affi);

}

async function auth(userId){
		const wallet = await buildWallet(Wallets, walletPath);
		const ccp = buildCCPOrg1();
		const gateway = new Gateway();
  
		try {
			const userIdentity = await wallet.get(userId);
			if (!userIdentity) {
				console.log("Auth failed")
			}
			console.log("Auth success")
		}catch{
			console.log("Auth failed")
		}
}
module.exports = {register,auth};







