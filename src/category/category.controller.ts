import { Request } from 'express';
import logger from '../util/logger';
import CategoryService from './category.service';
import { IValidateReq, ErrorCodes } from '../interfaces/interfaces';

export default async (req: Request) => {
  const { query, params }: { query: IValidateReq; params: { category?: string } } = req;
  try {
    logger.log('Logging request to get data for category from request controller');
    const newReq = new CategoryService(params.category as string, query);
    const data = await newReq.validateCategory();
    return {
      body: data,
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
