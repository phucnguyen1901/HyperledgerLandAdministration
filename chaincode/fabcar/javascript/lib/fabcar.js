/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class FabCar extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const lands = [
            {
                UserId: "b@gmail.com",
                Owner:"Nguyen Van A",
                IdentityCard:"385820222",
                HoKhauThuongTru:"Quân Ninh Kièu , TP.Càn Tho",
                ThuaDatSo: 931,
                ToBanDo5o: 3,
                CacSoThuaGiapRanh: [919, 905,803],
                DienTich: 393.1,
                ToaDoCacDinh: { "D1": [406836.70,1183891.04],"D2": [406836.75,1183891.44],
                "D3": [406836.80,1183891.37],"D4": [406836.79,1183891.40]},
                ChieuDaiCacCanh: {"C12": 20.5, "C23": 1.12, "C34" :7.53, "C41" :15.5},
                HinhThucSuDung:"Sử dụng riêng",
                MucDichSuDung: "Đất đai nông thôn",
                ThoiHanSuDung: "Lâu dài",
                NguocGocSuDung:"Nhà nưóc giao đất có thu tiền sử dụng",
                ThoiGianDangKy: "11/09/2021",
                Status: "Đã duyệt",
                UrlImage: "",
                Transactions: []
            },
        ];

        for (let i = 0; i < lands.length; i++) {
            lands[i].docType = 'land';
            await ctx.stub.putState('LANE' + i, Buffer.from(JSON.stringify(lands[i])));
            console.info('Added <--> ', lands[i]);
        }
        
           const Transfers = [
            {
                TimeStart:"01/10/2021",
                TimeEnd: "10/10/2021",
                From: "a123@gmail.com",
                To: "b123@gmail.com",
                ConfirmFromReceiver: false,
                ConfirmFromAdmin: false,
                Lane:"LANE0"
            }
        ]
         for (let i = 0; i < Transfers.length; i++) {
            Transfers[i].docType = 'trans';
            await ctx.stub.putState('TRANS' + i, Buffer.from(JSON.stringify(Transfers[i])));
            console.info('Added <--> ', Transfers[i]);
        }

        console.info('============= END : Initialize Ledger ===========');


    }

    async createLand(ctx,userId,owner,idCard,hktt,thuasodat,tobandoso,cacsothuagiapranh,dientich,toadocacdinh,chieudaicaccanh,hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,thoigiandangky){
        console.info('============= START : Create Land ===========');
        const land = {
                // ID:id,
                UserId:userId,
                Owner:owner,
                IdentityCard:idCard,
                HoKhauThuongTru:hktt,
                ThuaDatSo: thuasodat,
                ToBanDo5o: tobandoso,
                CacSoThuaGiapRanh: cacsothuagiapranh,
                DienTich: dientich,
                ToaDoCacDinh: JSON.parse(toadocacdinh),
                ChieuDaiCacCanh: JSON.parse(chieudaicaccanh),
                HinhThucSuDung:hinhthucsudung,
                MucDichSuDung: mucdichsudung,
                ThoiHanSuDung: thoihansudung,
                NguocGocSuDung:nguongocsudung,
                ThoiGianDangKy: thoigiandangky,
                Status: "Chưa duyệt",
                Transactions: [],
                docType: 'land'
        };
        let resultString = await this.checkLengthLand(ctx);
        let result = JSON.parse(resultString);
        await ctx.stub.putState(`LANE${result.length+1}`, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Create Land ===========');
    }

    async checkLengthLand(ctx){
        let queryString = {}
        queryString.selector = {"docType":"land"};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }

    async queryLand(ctx,key){
        const landAsBytes = await ctx.stub.getState(key); // get the car from chaincode state
        if (!landAsBytes || landAsBytes.length === 0) {
            // throw new Error(`${carNumber} does not exist`);
            return 'Not found';
        }
        console.log(landAsBytes.toString());
        return landAsBytes.toString();
    }

    async queryAllLands(ctx){
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

    async checkLength(ctx){
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
        return allResults.length;
    }

    async changeLandOwner(ctx,key,userId,newUserId, newIdCard, newOwner) {
        console.info('============= START : Update Land ===========');

        const landAsBytes = await ctx.stub.getState(key); // get the land from chaincode state
        if (!landAsBytes || landAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        let date_ob = new Date();
        let monthNow = date_ob.getMonth() < 10 ? `0${date_ob.getMonth()}` : `${date_ob.getMonth()}`;
        let newDate = `${date_ob.getDay()}/${monthNow}/${date_ob.getFullYear()}`;

        let newOb = {};
        newOb[newDate] = `Người sở hữu cũ :  "${userId}" chuyển cho người sở hữu mới "${newUserId}"`
        let land = JSON.parse(landAsBytes.toString());
        land.Owner = newOwner;
        land.IdentityCard = newIdCard;
        land.UserId = newUserId;
        let newTransactions = land.Transactions;
        newTransactions.push(newOb)
        land.Transactions = newTransactions;

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Update Land ===========');
    }

        async updateStatusLand(ctx,key,status) {
        console.info('============= START : Update Land ===========');

        const updateAsBytes = await ctx.stub.getState(key); // get the land from chaincode state
        if (!updateAsBytes || updateAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        let land = JSON.parse(updateAsBytes.toString());
        land.Status = status;

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Update Land ===========');
    }

    async checkLaneOwner(ctx,key,userId){

        const checkAsBytes = await ctx.stub.getState(key);
        if (!checkAsBytes || checkAsBytes.length === 0) {
            throw new Error(`${key} does not exist`);
        }

        let check = JSON.parse(checkAsBytes.toString());
        if(check.UserId == userId){
            return true;
        }

        return false;
    }

    
    async queryLaneByAdmin(ctx){
        let queryString = {}
        queryString.selector = {docType:'land'};
        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getIteratorData(iterator);
        return JSON.stringify(result);
    }

    async queryLaneByUser(ctx,userId,idCard,Owner){
        let queryString = {}
        queryString.selector = {"IdentityCard":idCard,"Owner":Owner,"UserId":userId, docType:'land'};
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

module.exports = FabCar;



