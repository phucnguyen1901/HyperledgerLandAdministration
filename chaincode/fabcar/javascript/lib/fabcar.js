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
                // (ctx,owner,gender,idCard,hktt,thuasodat,tobandoso,cacsothuagiapranh,dientich,toadocacdinh,chieudaicaccanh,hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,thoigiandangky)
                // ID:"asset1",
                Owner:"Nguyen Van A",
                Gender:'Nam',
                IdentityCard:"358525142",
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
                Status: "OK"
            },
        ];

        for (let i = 0; i < lands.length; i++) {
            lands[i].docType = 'land';
            await ctx.stub.putState('LANE' + i, Buffer.from(JSON.stringify(lands[i])));
            console.info('Added <--> ', lands[i]);
        }
        console.info('============= END : Initialize Ledger ===========');


    }

    async createLand(ctx,key,owner,gender,idCard,hktt,thuasodat,tobandoso,cacsothuagiapranh,dientich,toadocacdinh,chieudaicaccanh,hinhthucsudung,mucdichsudung,thoihansudung,nguongocsudung,thoigiandangky){
        console.info('============= START : Create Land ===========');
        const land = {
                // ID:id,
                Owner:owner,
                Gender:gender,
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
                Status: "Not OK",
                Transactions: []
        };
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(land)));
        console.info('============= END : Create Land ===========');
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

    async changeLandOwner(ctx, idCard, newOwner) {
        console.info('============= START : changeCarOwner ===========');

        const carAsBytes = await ctx.stub.getState(idCard); // get the car from chaincode state
        if (!carAsBytes || carAsBytes.length === 0) {
            throw new Error(`${idCard} does not exist`);
        }
        const car = JSON.parse(carAsBytes.toString());
        car.owner = newOwner;

        await ctx.stub.putState(carNumber, Buffer.from(JSON.stringify(car)));
        console.info('============= END : changeCarOwner ===========');
    }

    async queryLaneByUser(ctx,idCard,Owner){

        let queryString = {
            "selector": {
                "IdentityCard": "358525142",
                "Owner": "Nguyen Van A"
            }
        }

        let iterator = await ctx.stub.getQueryResult(JSON.stringify(queryString));
        let result = await this.getData(iterator)
        return JSON.stringify(result);
    }

    async getData(iterator){
        let resultArray = []
        while(true){
            let res = iterator.next()
            let resJson = {}

            if(res.value && res.value.value.toString()){
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


    // async TransferAsset(ctx, id, newOwner) {
    //     const assetString = await this.ReadAsset(ctx, id);
    //     const asset = JSON.parse(assetString);
    //     asset.Owner = newOwner;
    //     // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    //     return ctx.stub.putState(id, Buffer.from(stringify(sortKeysRecursive(asset))));
    // }

}

module.exports = FabCar;



