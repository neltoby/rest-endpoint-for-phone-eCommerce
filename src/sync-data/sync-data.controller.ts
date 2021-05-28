/* eslint-disable no-unused-vars */
import { Express } from 'express';

import SyncDataService from './sync-data.service';
import logger from '../util/logger';
import { ErrorCodes } from '../interfaces/interfaces';

export default async (req: Express): Promise<any> => {
  try {
    logger.log('Logging requesting for data retrievng from Google spreadsheet');
    const data = new SyncDataService();
    const allValues: any = await data.getData();
    return {
      body: allValues,
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
