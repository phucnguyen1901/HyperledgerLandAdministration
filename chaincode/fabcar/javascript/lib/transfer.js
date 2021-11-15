

/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Transfer extends Contract {
    
    async createTransfer(ctx,land,userTransfer,userReceive){
        console.info('============= START : Create transfer ===========');
        let date_ob = new Date();
        let monthNow = date_ob.getMonth() < 10 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
        let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
        const transfer = {
                Land:land,
                TimeStart: newDate,
                TimeEnd: "-/-/-",
                From: userTransfer,
                To: userReceive,
                ConfirmFromReceiver: false,
                ConfirmFromAdmin: false,
                docType: "trans"
        };
        let resultString = await this.checkLengthTransfer(ctx);
        let result = JSON.parse(resultString);
        await ctx.stub.putState(`TRANS${result.length+1}`, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Create transfer ===========');
    }

    async createTransferCoOwnerForOne(ctx,land,arrayUserTransfer,userReceive){
        console.info('============= START : Create transfer ===========');
        let date_ob = new Date();
        let monthNow = date_ob.getMonth() < 10 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
        let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;

        let arrayFrom = arrayUserTransfer.map((e) => ({e:false}));

        const transfer = {
                Land:land,
                TimeStart: newDate,
                TimeEnd: "-/-/-",
                From: arrayFrom,
                To: userReceive,
                ConfirmFromReceiver: false,
                ConfirmFromAdmin: false,
                docType: "trans"
        };
        let resultString = await this.checkLengthTransfer(ctx);
        let result = JSON.parse(resultString);
        await ctx.stub.putState(`TRANS${result.length+1}`, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Create transfer ===========');
    }

    async createTransferCoOwnerForCo(ctx,land,arrayUserTransfer,arrayUserReceiver){
        console.info('============= START : Create transfer ===========');
        let date_ob = new Date();
        let monthNow = date_ob.getMonth() < 10 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
        let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;

        let arrayFrom = arrayUserTransfer.map((e) => ({e:false}));
        let arrayReceive = arrayUserReceiver.map((e) => ({e:false}));

        const transfer = {
                Land:land,
                TimeStart: newDate,
                TimeEnd: "-/-/-",
                From: arrayFrom,
                To: arrayReceive,
                ConfirmFromAdmin: false,
                docType: "trans"
        };
        let resultString = await this.checkLengthTransfer(ctx);
        let result = JSON.parse(resultString);
        await ctx.stub.putState(`TRANS${result.length+1}`, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Create transfer ===========');
    }

    async checkLengthTransfer(ctx){
        let queryString = {}
        queryString.selector = {"docType":"trans"};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }

    async updateTransfer(ctx,key,role) {
        console.info('============= START : Update transfer ===========');

        const transferAsBytes = await ctx.stub.getState(key); // get the transfer from chaincode state
        if (!transferAsBytes || transferAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }
        let transfer = JSON.parse(transferAsBytes.toString());
        if(role == 'user'){
            transfer.ConfirmFromReceiver = true;
        }else{
            let date_ob = new Date();
            let monthNow = date_ob.getMonth() < 9 ? `0${date_ob.getMonth()+1}` : `${date_ob.getMonth()+1}`;
            let newDate = `${date_ob.getDate()}/${monthNow}/${date_ob.getFullYear()}`;
            transfer.ConfirmFromAdmin = true;
            transfer.TimeEnd = newDate;

        }

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Update transfer ===========');
    }



    async queryTransfers(ctx){
        const startKey = '';
        const endKey = '';
        const allResults = [];
        for await (const {key, value} of ctx.stub.getStateByRange(startKey, endKey)) {
            const strValue = Buffer.from(value).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: key, Record: record });
        }
        console.info(allResults);
        return JSON.stringify(allResults);
    }

    async queryTransferReceive(ctx,userId){
        let queryString = {}
        queryString.selector = {"docType":"trans","To":userId};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }

    async queryTransferOwner(ctx,userId){
        let queryString = {}
        queryString.selector = {"docType":"trans","From":userId};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }


    async queryTransferAll(ctx){
        let queryString = {}
        queryString.selector = {"docType":"trans"};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }


    async queryTransferRequest(ctx,userId,land){
        let queryString = {}
        queryString.selector = {"docType":"trans","From":userId,"Land":land};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        if(result < 1){
            queryString.selector = {"docType":"trans","To":userId,"Land":land};
            let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
            let result = await this.getIteratorData(iterator);
            return JSON.stringify(result);
        }
        return JSON.stringify(result);
    }

    async queryTransferOne(ctx,key){
        const transAsBytes = await ctx.stub.getState(key); // get the car from chaincode state
        if (!transAsBytes || transAsBytes.length === 0) {
            // throw new Error(`${carNumber} does not exist`);
            return 'Not found';
        }
        console.log(transAsBytes.toString());
        return transAsBytes.toString();
    }

    async getIteratorData(iterator){

        let resultArray = []

        while(true){
            let res = await iterator.next()
            let resJson = {}

            if(res.value && res.value.value.toString()){
                console.log(`res value: ${res.value.value.toString('utf8')}`);
                resJson.key = res.value.key;
                resJson.value = JSON.parse(res.value.value.toString('utf-8'));
                resultArray.push(resJson)
            }
            
            if(res.done){
                await iterator.close()
                return resultArray;
            }
        }
    }


    // DeleteAsset deletes an given asset from the world state.
    async DeleteAsset(ctx,key,userId,lane) {
        const transferAsBytes = await ctx.stub.getState(key);
        let result = JSON.parse(transferAsBytes);

        if(result.From != userId || result.Land != lane ) throw new Error(`${key} co loi khi xoa`);;
        await ctx.stub.deleteState(key);
    }

    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }

}

module.exports = Transfer;