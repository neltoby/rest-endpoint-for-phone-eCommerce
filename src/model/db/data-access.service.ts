/* eslint-disable no-return-await */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-throw-literal */
import CustomError from '../../util/error/error.service';
import logger from '../../util/logger';
import BuyRequest from '../schema/buyRequest';
import SellRequest from '../schema/sellRequest';
import { RequestData, ErrorCodes } from '../../interfaces/interfaces';
import DatabaseService from './db.service';

export default class DataAccessService extends DatabaseService {
  // eslint-disable-next-line class-methods-use-this
  public async insertToBuyRequest(data: RequestData) {
    try {
      // const allbuys = await BuyRequest.find({});
      // if (!allbuys.length) {
      logger.log('Preparing insert to Buy request collection.');
      const buyReqKey = 'Buy Request';
      const allkeys: Array<string> = Object.keys(data[buyReqKey]);
      logger.log('Checking connection status ...');
      logger.log(`Database connection status is ${DatabaseService.connection}`);
      if (DatabaseService.connection === 'connected') {
        logger.log('Database connection is set ...');
        logger.log('Dropping collection for buy request...');
        logger.log('Starting insert operation ...');
        await BuyRequest.collection.drop();
        return Promise.all(
          allkeys.map(async (item, i) => {
            const currentField = data[buyReqKey][item];
            const doc = new BuyRequest();
            doc.phone_name = item;
            doc.category = currentField.category;
            doc.description = currentField.description;
            await doc.save();
            return doc;
          }),
        );
        // eslint-disable-next-line no-else-return
      } else throw 'Database is not connected to a database instance.';
      // } else {
      //   return data;
      // }
    } catch (e) {
      logger.error(e);
      throw new CustomError(e, 500);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async insertToSellRequest(data: RequestData) {
    try {
      // const allsells = await SellRequest.find({});
      // if (!allsells.length) {
      logger.log('Preparing insert to Sell request collection.');
      const sellReqKey = 'Sell Requests';
      const allkeys: Array<string> = Object.keys(data[sellReqKey]);
      logger.log('Checking connection status ...');
      logger.log(`Database connection status is ${DatabaseService.connection}`);
      if (DatabaseService.connection === 'connected') {
        logger.log('Database connection is set ...');
        logger.log('Dropping collection for sell request...');
        logger.log('Starting insert operation ...');
        await SellRequest.collection.drop();
        return Promise.all(
          allkeys.map(async (item, i) => {
            const currentField = data[sellReqKey][item];
            const doc = new SellRequest();
            doc.phone_name = item;
            doc.category = currentField.category;
            doc.description = currentField.description;
            await doc.save();
            return doc;
          }),
        );
        // eslint-disable-next-line no-else-return
      } else throw 'Database is not connected to a database instance.';
      // } else {
      //   return data;
      // }
    } catch (e: any) {
      logger.error(e);
      throw new CustomError(e, 500);
    }
  }

  async findSellRequest(req: { page?: number; limit?: number }) {
    try {
      logger.log('Collecting sell request data.');
      const { page, limit } = req;
      const customLabels = {
        totalDocs: 'totalSell',
        docs: 'sellList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        pagingCounter: 'slNo',
        meta: 'paginator',
      };
      const options = { ...req, customLabels };
      return await SellRequest.paginate({}, options);
    } catch (e) {
      throw new CustomError(e, ErrorCodes.INTERNAL_SERVER_ERORR);
    }
  }

  async findBuyRequest(req: { page?: number; limit?: number }) {
    try {
      logger.log('Collecting buy request data.');
      const { page, limit } = req;
      const customLabels = {
        totalDocs: 'totalBuy',
        docs: 'buyList',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        pagingCounter: 'slNo',
        meta: 'paginator',
      };
      const options = { ...req, customLabels };
      return await BuyRequest.paginate({}, options);
    } catch (e: any) {
      throw new CustomError(e, ErrorCodes.INTERNAL_SERVER_ERORR);
    }
  }
}
