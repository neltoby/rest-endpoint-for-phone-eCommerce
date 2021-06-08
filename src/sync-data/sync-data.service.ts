/* eslint-disable camelcase */
import GetDataFromSheet from '../util/scripts/pull-sheet';
import logger from '../util/logger';
import { pulledData } from '../constants';
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
  }

  private manipulateData(rows: any[], pos: number): parentType | void {
    if (pos === 0) this.retrievedBuyRequestData = rows;
    else this.retrievedSellRequestData = rows;
    if (rows.length) {
      try {
        logger.log('Modifying data retrieved');
        const parent: parentType = {};
        let firstKey: string;
        let rowCount: number;
        let alldata: any[] = [];
        let objectCollector: { [key: string]: any } = {};
        rows.forEach((row: string[], i: number) => {
          const arr = [...row];
          if (i === 0) {
            [firstKey] = arr;
            parent[firstKey] = {};
          } else if (arr.length === 1 && i !== 0) {
            if (Object.keys(objectCollector).length) {
              const newObj: { [key: string]: any } = objectCollector;
              const oldObj: { [key: string]: any } = {};
              objectCollector = oldObj;
              alldata = [...alldata, newObj];
            }
            rowCount = 0;
            const [phone_name] = arr;
            objectCollector.phone_name = phone_name.toLowerCase();
            rowCount += 1;
          } else if (arr.includes('Storage Size') && arr.includes('New')) {
            arr.shift();
            objectCollector.heading = arr;
            rowCount += 1;
          } else if (rowCount === 2 && arr[0] !== '') {
            objectCollector.category = arr.shift();
            objectCollector[rowCount] = arr;
            rowCount += 1;
          } else if (arr[0] === '') {
            arr.shift();
            objectCollector[rowCount] = arr;
            rowCount += 1;
          }
        });

        alldata.forEach((item) => {
          const allKeys = Object.keys(item);
          parent[firstKey][item.phone_name] = {
            description: [],
            category: item.category,
          };
          let description: any = [];
          allKeys.forEach((key) => {
            const created_Obj: { [key: string]: string } = {};
            if (key !== 'heading' && key !== 'phone_name' && key !== 'category') {
              item.heading.forEach((head: string, i: number) => {
                created_Obj[head === 'Storage Size' ? 'storage_size' : head.toLowerCase()] = item[key][i];
              });
              description = [...description, created_Obj];
            }
          });
          parent[firstKey][item.phone_name].description = description;
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
