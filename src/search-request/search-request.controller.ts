import { Request } from 'express';
import SearchRequestService from './search-request.service';
import { ErrorCodes, ISearchReq } from '../interfaces/interfaces';
import logger from '../util/logger';
import CustomError from '../util/error/error.service';

export default async (req: Request) => {
  try {
    logger.log('Logging request for data from search controller');
    const { query }: { query: ISearchReq } = req;
    // eslint-disable-next-line no-nested-ternary
    const searchTerm: string | number | string[] = query.q !== undefined ? query.q : query.min && query.max ? [query.min, query.max] : 400;
    if (typeof searchTerm === 'number') {
      throw new CustomError('Query string not recognized', ErrorCodes.NOT_ACCEPTABLE);
    }
    const searchService = new SearchRequestService(searchTerm);
    searchService.validation({ page: query.page, limit: query.limit });
    const data = await searchService.searchTermType();
    return {
      body: data,
    };
  } catch (e) {
    logger.error(`Error retreiving search data - ${e}`);
    return {
      body: {
        error: e.message ? e.message : 'Server error',
        message: e.message ? e.message : 'Server error',
        status: e.status ? e.status : ErrorCodes.INTERNAL_SERVER_ERORR,
      },
    };
  }
};
