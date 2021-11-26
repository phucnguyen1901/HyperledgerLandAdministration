

/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Transfer extends Contract {
    
    async createTransfer(ctx,land,userTransfer1,userReceive1,time){
        console.info('============= START : Create transfer ===========');
        const transfer = {
                Land:land,
                TimeStart: time,
                TimeEnd: "-/-/-",
                From: userTransfer1,
                To: userReceive1,
                ConfirmFromReceiver: false,
                ConfirmFromAdmin: false,
                docType: "trans"
        };
        let resultString = await this.checkLengthTransfer(ctx);
        let result = JSON.parse(resultString);
        await ctx.stub.putState(`TRANS${result.length+1}`, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Create transfer ===========');
    }

    async createTransferOneOwnerForCo(ctx,land,userTransfer,arrayUserReceive,time){
        console.info('============= START : Create transfer ===========');
        let arrayTo = arrayUserReceive.split(',')
        let arrayReceive = []
        for(let i =0 ; i < arrayTo.length; i++){
            let obj = {}
            obj[arrayTo[i]] = false;
            arrayReceive.push(obj)
        }

        const transfer = {
                Land:land,
                TimeStart: time,
                TimeEnd: "-/-/-",
                From: userTransfer,
                To: arrayReceive,
                ConfirmFromAdmin: false,
                docType: "trans"
        };
        let resultString = await this.checkLengthTransfer(ctx);
        let result = JSON.parse(resultString);
        await ctx.stub.putState(`TRANS${result.length+1}`, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Create transfer ===========');
    }

    async createTransferCoOwnerForOne(ctx,land,arrayUserTransferList,userReceive1,time){
        console.info('============= START : Create transfer ===========');

        let arrayF = arrayUserTransferList.split(',')
        
        let arrayTransfer2 = []
        for(let i =0 ; i < arrayF.length; i++){
            let obj = {}
            if(i == 0){
                obj[arrayF[i]] = true;
                arrayTransfer2.push(obj)
            }else{
                obj[arrayF[i]] = false;
                arrayTransfer2.push(obj)
            }

        }
        const transfer = {
                Land:land,
                TimeStart: time,
                TimeEnd: "-/-/-",
                From: arrayTransfer2,
                To: userReceive1,
                ConfirmFromReceiver: false,
                ConfirmFromAdmin: false,
                docType: "trans"
        };
        let resultString = await this.checkLengthTransfer(ctx);
        let result = JSON.parse(resultString);
        await ctx.stub.putState(`TRANS${result.length+1}`, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Create transfer ===========');
    }


    async createTransferCoOwnerForCo(ctx,land,arrayUserTransfer,arrayUserReceiver,time){
        console.info('============= START : Create transfer ===========');
        let arrayFrom = arrayUserTransfer.split(',')
        let arrayTo = arrayUserReceiver.split(',')
        
        let arrayTransfer = []
        let arrayReceive = []

        for(let i =0 ; i < arrayFrom.length; i++){
            let obj = {}
            if(i == 0){
                obj[arrayFrom[i]] = true;
                arrayTransfer.push(obj)
            }else{
                obj[arrayFrom[i]] = false;
                arrayTransfer.push(obj)
            }
        }

        for(let i =0 ; i < arrayTo.length; i++){
            let obj = {}
            obj[arrayTo[i]] = false;
            arrayReceive.push(obj)

        }

        console.log(arrayTransfer)
        console.log(arrayReceive)

        const transfer = {
                Land:land,
                TimeStart: time,
                TimeEnd: "-/-/-",
                From: arrayTransfer,
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

    async updateTransfer(ctx,key,role,time) {
        console.info('============= START : Update transfer ===========');

        const transferAsBytes = await ctx.stub.getState(key); // get the transfer from chaincode state
        if (!transferAsBytes || transferAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }
        let transfer = JSON.parse(transferAsBytes.toString());
        if(role == 'user'){
            transfer.ConfirmFromReceiver = true;
        }else{
            transfer.ConfirmFromAdmin = true;
            transfer.TimeEnd = time;
        }

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(transfer)));
        console.info('============= END : Update transfer ===========');
    }

    async updateTransferCo(ctx,key,userId,position) {
        console.info('============= START : Update transfer ===========');

        const transferAsBytes = await ctx.stub.getState(key); // get the transfer from chaincode state
        if (!transferAsBytes || transferAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }
        let transfer = JSON.parse(transferAsBytes.toString());
        
        console.log(`USERID: ${userId}`)
        console.log(`USERID2: ${position}`)
        console.log(`USERID3: ${transfer.From[userId]}`)
        console.log(`USERID3: ${transfer.To[userId]}`)


        if(position == "from"){
            for(let i =0 ; i < transfer.From.length; i++){
                if(Object.keys(transfer.From[i]) == userId){
                    console.log(`++++++++++++++++ KEY FROM+++++++++++++++++++++`)
                    console.log(`un ${transfer.From[i][userId]}`)
                    transfer.From[i][userId] = true
                }
            }
        }else{
            for(let i =0 ; i < transfer.To.length; i++){
                if(Object.keys(transfer.To[i]) == userId){
                    console.log(`++++++++++++++++ KEY To+++++++++++++++++++++`)
                    console.log(`inn ${transfer.To[i][userId]}`)
                    transfer.To[i][userId] = true
                }
            }
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

        let query1 = {};
        let query2 = {};
        query1[userId] = false;
        query2[userId] = true;
        let queryString2 = {}
        queryString2.selector = {
            "To": {
               "$or": [
                  {
                     "$elemMatch": {
                        "$eq": query1
                     }
                  },
                  {
                     "$elemMatch": {
                        "$eq": query2
                     }
                  }
               ]
            },
            "docType": "trans"
         };
     
        let iterator2 = await ctx.stub.getQueryResult(JSON.stringify(queryString2));
        let result2 = await this.getIteratorData(iterator2);
        let allResult = [...result,...result2];
        return JSON.stringify(allResult);

    }

    async queryTransferOwner(ctx,userId){
        let queryString = {}
        queryString.selector = {"docType":"trans","From":userId};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);

        let query1 = {};
        let query2 = {};
        query1[userId] = false;
        query2[userId] = true;
        let queryString2 = {}
        queryString2.selector = {
            "From": {
               "$or": [
                  {
                     "$elemMatch": {
                        "$eq": query1
                     }
                  },
                  {
                     "$elemMatch": {
                        "$eq": query2
                     }
                  }
               ]
            },
            "docType": "trans"
         };
     
        let iterator2 = await ctx.stub.getQueryResult(JSON.stringify(queryString2));
        let result2 = await this.getIteratorData(iterator2);
        let allResult = [...result,...result2];
        return JSON.stringify(allResult);
    }
    async queryTransferOwnerTest(ctx,userId){
        let query = {};
        query[userId] = false;
        let queryString = {}
        queryString.selector = {
            "From": {
               "$or": [
                  {
                     "$elemMatch": {
                        "$eq": query
                     }
                  },
                  {
                     "$elemMatch": {
                        "$eq": query
                     }
                  }
               ]
            },
            "docType": "trans"
         };
     
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);

        return JSON.stringify(result);
    }

    // async queryTransferOwnerCo(ctx,userId){
    //     let queryString = {}
    //     queryString.selector = { "From": {
    //         "$elemMatch": {
    //            "$eq": userId
    //         }
    //      }, "docType":"trans"};
    //     let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
    //     let result = await this.getIteratorData(iterator);
    //     return JSON.stringify(result);
    // }


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