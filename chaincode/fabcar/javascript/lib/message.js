
/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Message extends Contract {
    
    async initLedger(ctx){
        const Messages = [
            {
                UserId: 'a@gmail.com',
                Time: "10/01/2021",
                Message: "Chào mừng bạn đã tham gia hệ thống",
                Seen: false,
            }
        ]
         for (let i = 0; i < Messages.length; i++) {
            Messages[i].docType = 'message';
            await ctx.stub.putState('Mes' + i, Buffer.from(JSON.stringify(Messages[i])));
            console.info('Added <--> ', Messages[i]);
        }

    }

    async queryMessages(ctx){
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

    async queryMessageOwner(ctx,userId){
        let queryString = {}
        queryString.selector = {"docType":"message","UserId":userId};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
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

module.exports = Message;










