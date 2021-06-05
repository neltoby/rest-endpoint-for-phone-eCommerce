/* eslint-disable camelcase */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
export interface IPhoneXtics {
  storage_size: string;
  new: string;
  a1: string;
  a2: string;
  b1: string;
  b2: string;
  c: string;
  'c/b': string;
  'c/d': string;
}

export type PhoneInfo = {
  description: Array<IPhoneXtics>;
  category: string;
};
export type PhoneObject = {
  [key: string]: PhoneInfo;
};

export type RequestData = {
  [key: string]: PhoneObject;
};

export interface AllProp extends PhoneInfo {
  // eslint-disable-next-line camelcase
  phone_name: string;
  id?: string;
}

// eslint-disable-next-line no-shadow
export enum ReqParam {
  buy = 'buy',
  sell = 'sell',
}

export interface IValidateReq {
  page?: number | string;
  limit?: number | string;
  req?: ReqParam;
}

export interface IValidatedReq extends IValidateReq {
  page?: number;
  limit?: number;
}

export interface ISearchReq {
  q?: string;
  min?: string;
  max?: string;
}

export enum ErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 403,
  NOT_ACCEPTABLE = 406,
  INTERNAL_SERVER_ERORR = 500,
}

export interface IDataDescription extends IPhoneXtics {
  _id: string;
}

export interface IRetResDesc {
  _id: string;
  storage_size?: string;
  new?: string;
  a1?: string;
  a2?: string;
  b1?: string;
  b2?: string;
  c?: string;
  'c/b'?: string;
  'c/d'?: string;
}

export interface IRetRes {
  _id: string;
  description: IRetResDesc[];
  phone_name: string;
  category: string;
}

export enum DataDescEnum {
  _id = '_id',
  storage_size = 'storage_size',
  new = 'new',
  a1 = 'a1',
  a2 = 'a2',
  b1 = 'b1',
  b2 = 'b2',
  c = 'c',
  'c/b' = 'c/b',
  'c/d' = 'c/d',
}

export interface IDataCollected {
  _id: string;
  description: IDataDescription[];
  phone_name: string;
  category: string;
  __v: number;
}

export interface IRetVal {
  phone_name: string;
  category: string;
  storage: string;
  condition: string;
  price: string;
}

export interface IRetSellDataFromDb {
  sellList?: IDataCollected[];
  buyList?: IDataCollected[];
  paginator?: {
    totalSell: number;
    perPage: number;
    pageCount: number;
    currentPage: number;
    slNo: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    next: number | null;
    prev: number | null;
  };
}

export interface IGeneralObj {
  [key: string]: string;
}

export interface IPriceReq {
  min: number;
  max: number;
}

export interface ICacheVariable {
  varName: string;
  varValue: any;
}

export interface ICacheRetVal {
  action: string;
  success: boolean;
  message: string;
}

export interface IGetCacheRetValSuccess {
  action: string;
  success: boolean;
  message: string;
  value: any;
}

export interface IGetCacheRetValFailure {
  action: string;
  success: boolean;
  message: string;
}
