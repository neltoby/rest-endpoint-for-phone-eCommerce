/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-await */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-vars */
/* eslint-disable no-throw-literal */
import { PaginateResult } from 'mongoose';
import CustomError from '../../util/error/error.service';
import logger from '../../util/logger';

import {
  RequestData,
  ErrorCodes,
  IRetSellDataFromDb,
  IGeneralObj,
  IRetRes,
  IRetResDesc,
  IPriceReq,
  ISearchOptions,
} from '../../interfaces/interfaces';
import DatabaseService from './db.service';
import sortByPrice from '../../util/scripts/sort-by-price';

export default class DataAccessService extends DatabaseService {
  // eslint-disable-next-line class-methods-use-this
  public async insertToBuyRequest(data: RequestData) {
    try {
      // const allbuys = await BuyRequest.find({});
      logger.log('Preparing insert to Buy request collection.');
      const buyReqKey = 'Buy Request';
      const allkeys: Array<string> = Object.keys(data[buyReqKey]);
      logger.log('Checking connection status ...');
      logger.log(`Database connection status is ${DatabaseService.connection}`);
      if (DatabaseService.connection === 'connected') {
        logger.log('Database connection is set ...');
        logger.log('Dropping collection for buy request...');
        logger.log('Starting insert operation ...');
        return Promise.all(
          allkeys.map(async (item, i) => {
            const currentField = data[buyReqKey][item];
            const doc = new this.BuyRequest();
            doc.phone_name = item;
            doc.category = currentField.category;
            doc.description = currentField.description;
            await doc.save();
            return doc;
          }),
        );
        // eslint-disable-next-line no-else-return
      } else throw 'Database is not connected to a database instance.';
    } catch (e) {
      logger.error(e);
      throw new CustomError(e, 500);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  public async insertToSellRequest(data: RequestData) {
    try {
      const sellReqKey = 'Sell Requests';
      const allkeys: Array<string> = Object.keys(data[sellReqKey]);
      logger.log('Preparing insert to Sell request collection.');
      logger.log('Checking connection status ...');
      logger.log(`Database connection status is ${DatabaseService.connection}`);
      if (DatabaseService.connection === 'connected') {
        logger.log('Database connection is set ...');
        logger.log('Dropping collection for sell request...');
        logger.log('Starting insert operation ...');
        return Promise.all(
          allkeys.map(async (item, i) => {
            const currentField = data[sellReqKey][item];
            const doc = new this.SellRequest();
            doc.phone_name = item;
            doc.category = currentField.category;
            doc.description = currentField.description;
            await doc.save();
            return doc;
          }),
        );
        // eslint-disable-next-line no-else-return
      } else throw 'Database is not connected to a database instance.';
    } catch (e: any) {
      logger.error(e);
      throw new CustomError(e, 500);
    }
  }

  // eslint-disable-next-line max-len
  async findSellRequest(req: {
    page?: number;
    limit?: number;
  }): Promise<PaginateResult<IRetSellDataFromDb>> {
    try {
      logger.log('Collecting sell request data.');
      const { page, limit } = req;
      const customLabels = {
        totalDocs: 'totalDocs',
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
      return await this.SellRequest.paginate({}, options);
    } catch (e) {
      throw new CustomError(e, ErrorCodes.INTERNAL_SERVER_ERORR);
    }
  }

  // eslint-disable-next-line max-len
  async findBuyRequest(req: {
    page?: number;
    limit?: number;
  }): Promise<PaginateResult<IRetSellDataFromDb>> {
    try {
      logger.log('Collecting buy request data.');
      const { page, limit } = req;
      const customLabels = {
        totalDocs: 'totalDocs',
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
      return await this.BuyRequest.paginate({}, options);
    } catch (e: any) {
      throw new CustomError(e, ErrorCodes.INTERNAL_SERVER_ERORR);
    }
  }

  async findByArrayTerm(
    arr: Array<IGeneralObj | undefined>,
    req: { page?: number; limit?: number },
  ): Promise<any> {
    try {
      logger.log('Calling extraction function for the current data');
      const newArr = arr.filter((item: IGeneralObj | undefined) => item !== undefined);
      let condition: boolean = false;
      let conditionValues: { condition?: string } = {};
      // eslint-disable-next-line camelcase
      let combinedObj: { phone_name?: string; 'description.storage_size'?: string } = {};
      newArr.forEach((item, i: number) => {
        if (item !== undefined) {
          if (Object.keys(item)[0] === 'condition') {
            condition = true;
            conditionValues = { ...item };
          } else {
            combinedObj = { ...combinedObj, ...item };
          }
        }
      });
      let retData: IRetRes[];
      let retVal: any[];
      const customLabels = {
        totalDocs: 'totalDocs',
        docs: 'data',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        pagingCounter: 'slNo',
        meta: 'paginator',
      };
      let totalDocs: number;
      let perPage: number;
      let pageCount: number;
      let currentPage: number;
      let slNo: number;
      let hasPrevPage: boolean;
      let hasNextPage: boolean;
      let prev: number | null;
      let next: number | null;
      const options: ISearchOptions = { ...req, customLabels };
      if (condition) {
        const select: { [key: string]: number } = {};
        const condVal = `description.${conditionValues.condition}`;
        select.phone_name = 1;
        select.category = 1;
        select['description.storage_size'] = 1;
        select[condVal] = 1;
        options.select = select;
        retVal = await Promise.all([
          this.BuyRequest.paginate(combinedObj, options),
          this.SellRequest.paginate(combinedObj, options),
        ]);
        retData = [...retVal[0].data, ...retVal[1].data];
      } else {
        const select: { [key: string]: number } = {};
        select.phone_name = 1;
        select.category = 1;
        select.description = 1;
        options.select = select;
        retVal = await Promise.all([
          this.BuyRequest.paginate(combinedObj, options),
          this.SellRequest.paginate(combinedObj, options),
        ]);
        retData = [...retVal[0].data, ...retVal[0].data];
      }
      if (retData) {
        if (combinedObj['description.storage_size']) {
          const desc = retData.map((item: IRetRes) => {
            const newArr = item.description.filter(
              (filt: IRetResDesc) => filt.storage_size === combinedObj['description.storage_size'],
            );
            item.description = newArr;
            return item;
          });
          return desc;
        }
        totalDocs = retVal[0].paginator.totalDocs + retVal[1].paginator.totalDocs;
        perPage = retVal[0].paginator.perPage + retVal[1].paginator.perPage;
        pageCount = retVal[0].paginator.pageCount + retVal[1].paginator.pageCount;
        currentPage = retVal[0].paginator?.currentPage || retVal[1].paginator?.currentPage;
        slNo = retVal[0].paginator?.slNo || retVal[1].paginator?.slNo;
        hasPrevPage = retVal[0].paginator?.hasPrevPage === true
          ? retVal[0].paginator.hasPrevPage
          : retVal[1].paginator.hasPrevPage;
        hasNextPage = retVal[0].paginator?.hasNextPage === true
          ? retVal[0].paginator.hasNextPage
          : retVal[1].paginator.hasNextPage;
        prev = retVal[0].paginator?.prev || retVal[1].paginator?.prev;
        next = retVal[0].paginator?.next > retVal[1].paginator?.next
          ? retVal[0].paginator.next
          : retVal[0].paginator.next;
        return {
          data: retData,
          paginator: {
            totalDocs,
            perPage,
            pageCount,
            currentPage,
            slNo,
            hasPrevPage,
            hasNextPage,
            prev,
            next,
          },
        };
      }
    } catch (e: any) {
      throw new CustomError(e, ErrorCodes.INTERNAL_SERVER_ERORR);
    }
  }

  async findByPriceRange(price: IPriceReq, req: { page?: number; limit?: number }) {
    try {
      const { min, max } = price;
      let { page, limit } = req;
      const retVal = await Promise.all([
        this.SellRequest.find({}).exec(),
        this.BuyRequest.find({}).exec(),
      ]);
      const retData = [...sortByPrice(retVal[0], price), ...sortByPrice(retVal[1], price)];
      limit = (limit as number) * 10;
      page = page as number;
      const start = ((page as number) - 1) * limit;
      const end = start + (limit - 1);
      const currentData = retData.filter((item: any, i: number) => i >= start && i <= end);
      const pageCount = Math.ceil(retData.length / limit);
      return {
        data: currentData,
        paginator: {
          totalDocs: retData.length,
          perPage: limit / 10,
          pageCount,
          currentPage: page,
          slNo: 1,
          hasPrevPage: page !== 1,
          hasNextPage: page < pageCount,
          prev: page < 2 ? null : page - 1,
          next: pageCount > page ? page + 1 : null,
        },
      };
    } catch (e) {
      logger.log(
        `Errored while fetching data for search request by price in findByPriceRange method - ${e}`,
      );
      throw new CustomError(e, ErrorCodes.INTERNAL_SERVER_ERORR);
    }
  }

  async findCategory(
    category: string,
    req: { page?: number; limit?: number },
  ): Promise<PaginateResult<IRetSellDataFromDb>> {
    try {
      const { page, limit } = req;
      const customLabels = {
        totalDocs: 'totalDocs',
        docs: 'category',
        limit: 'perPage',
        page: 'currentPage',
        nextPage: 'next',
        prevPage: 'prev',
        totalPages: 'pageCount',
        pagingCounter: 'slNo',
        meta: 'paginator',
      };
      const options = { ...req, customLabels };
      return await this.BuyRequest.paginate({ phone_name: category }, options);
    } catch (e) {
      logger.log(
        `Errored while fetching data for find by category request by price findCategory method - ${e}`,
      );
      throw new CustomError(e, ErrorCodes.INTERNAL_SERVER_ERORR);
    }
  }
}
