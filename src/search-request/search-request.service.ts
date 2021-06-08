/* eslint-disable no-undef */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-return-await */
/* eslint-disable no-underscore-dangle */
import {
  ErrorCodes,
  IDataCollected,
  IGeneralObj,
  IValidateReq,
  IValidatedReq,
} from '../interfaces/interfaces';
import DataAccessService from '../model/db/data-access.service';
import CustomError from '../util/error/error.service';
import logger from '../util/logger';
import dataAdapterFxn from '../util/scripts/data-adapter';
import { allTypes } from '../constants';

export default class SearchRequestService {
  private dataAccess: DataAccessService;

  private sortedArray: Array<IGeneralObj | undefined>;

  private query: IValidatedReq;

  set searchTerm(val: string | string[]) {
    this._searchTerm = val;
  }

  get searchTerm() {
    return this._searchTerm;
  }

  // eslint-disable-next-line no-unused-vars
  constructor(private _searchTerm: string | string[]) {
    this.dataAccess = new DataAccessService();
    this.sortedArray = [];
    this.sortedArray.fill(undefined, 0, 2);
    this.query = {};
  }

  private async searchTermStr(): Promise<any> {
    const searchTerm = this.searchTerm as string;
    if (searchTerm.includes(',')) {
      const arrStr: string[] = searchTerm.split(',');
      if (arrStr.length > 0) {
        arrStr.forEach((item: string) => {
          this.sortArrayElement(item);
        });
      }
    } else {
      this.sortArrayElement(searchTerm);
    }
    const data = await this.dataAccess.findByArrayTerm(this.sortedArray, this.query);
    return {
      data: this.dataAdapter(data.data),
      paginator: data.paginator,
    };
  }

  private sortArrayElement(val: string) {
    const allCondition = ['new', 'a1', 'a2', 'b1', 'b2', 'c', 'c/b', 'c/d'];
    const allStorage = ['16gb', '32gb', '64gb', '128gb', '256gb', '512gb'];
    const lowerCase = val.trim().toLowerCase();
    if (allTypes.includes(lowerCase)) {
      this.sortedArray[0] = { phone_name: lowerCase };
    } else if (allCondition.includes(lowerCase)) {
      this.sortedArray[1] = { condition: lowerCase };
    } else if (allStorage.includes(lowerCase)) {
      this.sortedArray[2] = { 'description.storage_size': lowerCase.toUpperCase() };
    } else {
      throw new CustomError('Search query is invalid.', ErrorCodes.BAD_REQUEST);
    }
  }

  validation(query: IValidateReq) {
    // eslint-disable-next-line prefer-const
    let { page = 1, limit = 2 } = query;
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
    this.query = retVal;
  }

  // eslint-disable-next-line class-methods-use-this
  private dataAdapter(data: IDataCollected[]) {
    return dataAdapterFxn(data);
  }

  // eslint-disable-next-line class-methods-use-this
  private async searchTermArr() {
    const [min, max] = this.searchTerm as string[];
    let minNum;
    let maxNum: unknown;
    if (min.charAt(0) === '$') {
      try {
        minNum = parseInt(min.slice(1), 10) as number;
        if (Number.isNaN(minNum)) {
          throw new CustomError(
            'Invalid minimum value. Minimum number is not a valid number',
            ErrorCodes.BAD_REQUEST,
          );
        }
      } catch (e: any) {
        if (e instanceof CustomError) throw e;
        throw new CustomError(
          'Invalid minimum value. Its possibly not a valid amount',
          ErrorCodes.BAD_REQUEST,
        );
      }
    } else {
      try {
        minNum = parseInt(min, 10);
        if (Number.isNaN(minNum)) {
          throw new CustomError(
            'Invalid minimum value. Minimum number is not a valid number',
            ErrorCodes.BAD_REQUEST,
          );
        }
      } catch (e: any) {
        if (e instanceof CustomError) throw e;
        throw new CustomError(
          'Invalid minimum value. Its possibly not a valid amount',
          ErrorCodes.BAD_REQUEST,
        );
      }
    }

    if (max.charAt(0) === '$') {
      try {
        maxNum = parseInt(max.slice(1), 10) as number;
        if (Number.isNaN(maxNum)) {
          throw new CustomError(
            'Invalid maximum value. Maximum number is not a valid number',
            ErrorCodes.BAD_REQUEST,
          );
        }
      } catch (e: any) {
        if (e instanceof CustomError) throw e;
        throw new CustomError(
          'Invalid maximum value. Its possibly not a valid amount',
          ErrorCodes.BAD_REQUEST,
        );
      }
    } else {
      try {
        maxNum = parseInt(max, 10);
        if (Number.isNaN(maxNum)) {
          throw new CustomError(
            'Invalid maximum value. Maximum number is not a valid number',
            ErrorCodes.BAD_REQUEST,
          );
        }
      } catch (e: any) {
        if (e instanceof CustomError) throw e;
        throw new CustomError(
          'Invalid maximum value. Its possibly not a valid amount',
          ErrorCodes.BAD_REQUEST,
        );
      }
    }
    const minNumber = minNum as number;
    const maxNumber = maxNum as number;
    if (minNumber > maxNumber) {
      throw new CustomError(
        'Invalid Range. Minimum value must be less than maximum value',
        ErrorCodes.NOT_ACCEPTABLE,
      );
    }
    const data = await this.dataAccess.findByPriceRange(
      { min: minNumber, max: maxNumber },
      this.query,
    );
    return {
      data: this.dataAdapter(data.data),
      paginator: data.paginator,
    };
  }

  async searchTermType() {
    if (typeof this.searchTerm === 'string') {
      logger.log('Calling search method for string data');
      return await this.searchTermStr();
    }
    logger.log('Calling search method for array data');
    return await this.searchTermArr();
  }
}
