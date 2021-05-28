import { Request } from 'express';
import logger from '../util/logger';
import GetRequestService from './get-request.service';
import { IValidateReq, ErrorCodes } from '../interfaces/interfaces';

export default async (req: Request) => {
  const { query }: { query: IValidateReq } = req;
  try {
    logger.log('Logging request to get data from request controller');
    const newReq = new GetRequestService(query);
    const data: any = await newReq.checkReq();
    return {
      body: {
        ...data,
      },
    };
  } catch (e) {
    return {
      body: {
        error: e.message ? e.message : 'Server error',
        message: e.message ? e.message : 'Server error',
        status: e.status ? e.status : ErrorCodes.INTERNAL_SERVER_ERORR,
      },
    };
  }
};
