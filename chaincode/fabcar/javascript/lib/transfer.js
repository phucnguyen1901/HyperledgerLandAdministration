

/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Transfer extends Contract {
    
    async createTransfer(ctx,lane,userTransfer,userReceive){
        console.info('============= START : Create transfer ===========');
        let date_ob = new Date();
        let monthNow = date_ob.getMonth() < 10 ? `0${date_ob.getMonth()}` : `${date_ob.getMonth()}`;
        let newDate = `${date_ob.getDay()}/${monthNow}/${date_ob.getFullYear()}`;
        const transfer = {
                Lane:lane,
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
            transfer.ConfirmFromAdmin = true;
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

    async queryTransferAll(ctx){
        let queryString = {}
        queryString.selector = {"docType":"trans"};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }


    async queryTransferRequest(ctx,userId,lane){
        let queryString = {}
        queryString.selector = {"docType":"trans","From":userId,"Lane":lane};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        if(result < 1){
            queryString.selector = {"docType":"trans","To":userId,"Lane":lane};
            let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
            let result = await this.getIteratorData(iterator);
            return JSON.stringify(result);
        }
        return JSON.stringify(result);
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

}

module.exports = Transfer;