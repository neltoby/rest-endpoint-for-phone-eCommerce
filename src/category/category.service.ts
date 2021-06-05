/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import DataAccessService from '../model/db/data-access.service';
import { allTypes } from '../constants';
import CustomError from '../util/error/error.service';
import {
  ErrorCodes, IValidatedReq, IValidateReq, IDataCollected,
} from '../interfaces/interfaces';
import dataAdapter from '../util/scripts/data-adapter';

export default class CategoryService {
  private dataAccess: DataAccessService;

  private query: IValidatedReq;

  constructor(private category: string, query: IValidateReq) {
    this.dataAccess = new DataAccessService();
    this.query = this.validation(query);
  }

  async validateCategory() {
    const categoryToLowerCase = this.category.trim().toLowerCase();
    if (categoryToLowerCase === 'all') {
      const data: any = await this.dataAccess.findBuyRequest(this.query);
      const category = dataAdapter(data.buyList as IDataCollected[]);
      data.category = category;
      delete data.buyList;
      return data;
    }
    if (allTypes.includes(categoryToLowerCase)) {
      const data: any = await this.dataAccess.findCategory(this.category, this.query);
      const category = dataAdapter(data.category);
      data.category = category;
      return data;
    }
    throw new CustomError('Phones does not yet exist.', ErrorCodes.NOT_ACCEPTABLE);
  }

  // eslint-disable-next-line class-methods-use-this
  validation(query: IValidateReq): IValidatedReq {
    // eslint-disable-next-line prefer-const
    let { page = 1, limit = 5 } = query;
    const retVal: IValidatedReq = {};
    if (typeof page === 'string') {
      try {
        page = parseInt(page, 10);
      } catch (e) {
        throw new CustomError('Query string "page" must be an integer', ErrorCodes.BAD_REQUEST);
      }
    }

    if (typeof page === 'number') retVal.page = page;

    if (typeof limit === 'string') {
      try {
        limit = parseInt(limit, 10);
      } catch (e) {
        throw new CustomError('Query string "limit" must be an integer', ErrorCodes.BAD_REQUEST);
      }
    }

    if (typeof limit === 'number') retVal.limit = limit;
    return retVal;
  }
}
