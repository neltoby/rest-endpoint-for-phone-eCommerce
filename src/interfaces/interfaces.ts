/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
export interface IPhoneXtics {
  'Storage Size': string;
  New: string;
  A1: string;
  A2: string;
  B1: string;
  B2: string;
  C: string;
  'C/B': string;
  'C/D': string;
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
  page?: number,
  limit?: number
}

export enum ErrorCodes {
  BAD_REQUEST = 400,
  NOT_FOUND = 403,
  NOT_ACCEPTABLE = 406,
  INTERNAL_SERVER_ERORR = 500,
}
