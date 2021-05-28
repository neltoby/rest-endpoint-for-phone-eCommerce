import GetDataFromSheet from '../util/scripts/pull-sheet';
import logger from '../util/logger';
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
        let unLockedValue: any;
        let heading: any[];
        let firstKey: string;
        let parentKey: string;
        let row2: any[];
        let row3: any[];
        let row4: any[];
        let rowCount: number;
        rows.forEach((row: string[], i: number) => {
          const arr = [...row];
          if (i === 0) {
            [firstKey] = arr;
            parent[firstKey] = {};
          } else if (arr.length === 1 && i !== 0) {
            rowCount = 0;
            [parentKey] = arr;
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
          } else if (rowCount === 3 && arr[0] === '') {
            arr.shift();
            row4 = arr;
            parent[firstKey][parentKey] = {};
            let arrVal = [];
            const firstrow: parentType = {};
            const secondrow: parentType = {};
            const thirdrow: parentType = {};
            heading.forEach((item, ii) => {
              firstrow[item] = row2[ii];
              secondrow[item] = row3[ii];
              thirdrow[item] = row4[ii];
            });
            arrVal = [firstrow, secondrow, thirdrow];
            parent[firstKey][parentKey].category = unLockedValue;
            parent[firstKey][parentKey].description = arrVal;
            rowCount = 0;
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

  async getData() {
    const data = await this.getSheet.authorize();
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
