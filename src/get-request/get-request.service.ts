/* eslint-disable no-return-await */
/* eslint-disable no-else-return */
/* eslint-disable class-methods-use-this */
import DataAccessService from '../model/db/data-access.service';
import {
  ErrorCodes, IValidateReq, IValidatedReq, ReqParam,
} from '../interfaces/interfaces';
import CustomError from '../util/error/error.service';

export default class GetRequestService {
  private dataAccess: DataAccessService;

  private query: IValidatedReq;

  constructor(query: IValidateReq) {
    this.dataAccess = new DataAccessService();
    this.query = this.validation(query);
  }

  async checkReq() {
    if (this.query.req === ReqParam.buy) return await this.getBuyRequest(this.query);
    else return await this.getSellRequest(this.query);
  }

  async getSellRequest(req: IValidatedReq) {
    const { page, limit } = req;
    return await this.dataAccess.findSellRequest({ page, limit });
  }

  async getBuyRequest(req: IValidatedReq) {
    const { page, limit } = req;
    return await this.dataAccess.findBuyRequest({ page, limit });
  }

  validation(query: IValidateReq): IValidatedReq {
    // eslint-disable-next-line prefer-const
    let { page = 1, limit = 5, req } = query;
    const retVal: IValidatedReq = {};
    if (!req) {
      throw new CustomError('Query parameter req missing.', ErrorCodes.NOT_ACCEPTABLE);
    }
    if (req !== ReqParam.buy && req !== ReqParam.sell) {
      throw new CustomError(
        'Query string req can either be "buy" or "sell',
        ErrorCodes.BAD_REQUEST,
      );
    }
    retVal.req = req;
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
