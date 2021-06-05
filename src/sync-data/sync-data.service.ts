import GetDataFromSheet from '../util/scripts/pull-sheet';
import logger from '../util/logger';
import { pulledData } from '../constants';
import {
  ICacheVariable,
  IGetCacheRetValSuccess,
  IGetCacheRetValFailure,
} from '../interfaces/interfaces';
import DataAccessService from '../model/db/data-access.service';

type parentType = {
  [key: string]: any;
};

export default class SyncDataService {
  private getSheet: GetDataFromSheet;

  private dataservice: DataAccessService;

  public retrievedBuyRequestData: any[];

  public retrievedSellRequestData: any[];

  public buyRequestData: parentType;

  public sellRequestData: parentType;

  // private redisConnection: RedisClient;

  constructor() {
    this.retrievedBuyRequestData = [];
    this.retrievedSellRequestData = [];
    this.buyRequestData = {};
    this.sellRequestData = {};
    this.getSheet = new GetDataFromSheet();
    this.dataservice = new DataAccessService();
    // this.redisConnection = redisClient;
  }

  private manipulateData(rows: any[], pos: number): parentType | void {
    if (pos === 0) this.retrievedBuyRequestData = rows;
    else this.retrievedSellRequestData = rows;
    if (rows.length) {
      try {
        logger.log('Modifying data retrieved');
        const parent: parentType = {};
        let unLockedValue: any;
        let heading: any[];
        let firstKey: string;
        let parentKey: string;
        let row2: any[];
        let row3: any[];
        let row4: any[];
        let row5: any[];
        let rowCount: number;
        rows.forEach((row: string[], i: number) => {
          const arr = [...row];
          if (i === 0) {
            [firstKey] = arr;
            parent[firstKey] = {};
          } else if (rowCount === undefined && arr.length === 1 && i !== 0) {
            rowCount = 0;
            [parentKey] = arr;
            parentKey = parentKey.toLowerCase();
          } else if (rowCount === 0 && arr[1] === 'Storage Size' && arr.includes('New')) {
            arr.shift();
            heading = arr;
            rowCount = 1;
          } else if (rowCount === 1 && arr[0] !== '') {
            unLockedValue = arr.shift();
            row2 = arr;
            rowCount = 2;
          } else if (rowCount === 2 && arr[0] === '') {
            arr.shift();
            row3 = arr;
            rowCount = 3;
          } else if (rowCount === 2 && arr.length === 1) {
            parent[firstKey][parentKey] = {};
            let arrVal = [];
            const firstrow2: parentType = {};
            heading.forEach((item, i2) => {
              firstrow2[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row2[i2];
            });
            arrVal = [firstrow2];
            parent[firstKey][parentKey].category = unLockedValue.toLowerCase();
            parent[firstKey][parentKey].description = arrVal;
            rowCount = 0;
            [parentKey] = arr;
            parentKey = parentKey.toLowerCase();
          } else if (rowCount === 3 && arr[0] === '') {
            arr.shift();
            row4 = arr;
            rowCount = 4;
          } else if (rowCount === 3 && arr.length === 1) {
            parent[firstKey][parentKey] = {};
            let arrVal = [];
            const firstrow3: parentType = {};
            const secondrow3: parentType = {};
            heading.forEach((item, i3) => {
              firstrow3[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row2[i3];
              secondrow3[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row3[i3];
            });
            arrVal = [firstrow3, secondrow3];
            parent[firstKey][parentKey].category = unLockedValue.toLowerCase();
            parent[firstKey][parentKey].description = arrVal;
            rowCount = 0;
            [parentKey] = arr;
            parentKey = parentKey.toLowerCase();
          } else if (rowCount === 4 && arr.length === 1) {
            parent[firstKey][parentKey] = {};
            let arrVal = [];
            const firstrow4: parentType = {};
            const secondrow4: parentType = {};
            const thirdrow4: parentType = {};
            heading.forEach((item, i4) => {
              firstrow4[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row2[i4];
              secondrow4[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row3[i4];
              thirdrow4[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row4[i4];
            });
            arrVal = [firstrow4, secondrow4, thirdrow4];
            parent[firstKey][parentKey].category = unLockedValue.toLowerCase();
            parent[firstKey][parentKey].description = arrVal;
            rowCount = 0;
            [parentKey] = arr;
            parentKey = parentKey.toLowerCase();
          } else if (rowCount === 4 && arr[0] === '') {
            arr.shift();
            row5 = arr;
            rowCount = 5;
          } else if (rowCount === 5 && arr.length === 1) {
            parent[firstKey][parentKey] = {};
            let arrVal = [];
            const firstrow5: parentType = {};
            const secondrow5: parentType = {};
            const thirdrow5: parentType = {};
            const fourthrow5: parentType = {};
            heading.forEach((item, i5) => {
              firstrow5[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row2[i5];
              secondrow5[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row3[i5];
              thirdrow5[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row4[i5];
              fourthrow5[item === 'Storage Size' ? 'storage_size' : item.toLowerCase()] = row5[i5];
            });
            arrVal = [firstrow5, secondrow5, thirdrow5, fourthrow5];
            parent[firstKey][parentKey].category = unLockedValue.toLowerCase();
            parent[firstKey][parentKey].description = arrVal;
            rowCount = 0;
            [parentKey] = arr;
            parentKey = parentKey.toLowerCase();
          }
        });
        logger.log('Data successfully manipulated');
        if (pos === 0) this.buyRequestData = parent;
        else this.sellRequestData = parent;
        return parent;
      } catch (e: any) {
        logger.log(`Could not manipulate the data received - ${e.toString()}`);
      }
    } else {
      logger.log('No data found.');
    }
  }

  async getData(setCacheFxn: Function, getCacheFxn: Function) {
    let data: any[];
    const getData = await getCacheFxn(pulledData);
    if (!getData.success) {
      data = await this.getSheet.authorize();
      const cacheRes = await setCacheFxn({ varName: pulledData, varValue: data });
      console.log(cacheRes);
    } else {
      data = getData.value;
    }
    this.manipulateData(data[0].data.values, 0);
    this.manipulateData(data[1].data.values, 1);
    const buyData = await this.dataservice.insertToBuyRequest(this.buyRequestData);
    logger.log('Buy request operation successful!');
    const sellData = await this.dataservice.insertToSellRequest(this.sellRequestData);
    logger.log('Sell request operation successful!');
    return {
      buyReq: buyData,
      sellReq: sellData,
    };
  }
}
