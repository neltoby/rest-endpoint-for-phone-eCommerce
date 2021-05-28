import logger from '../logger';

export default class CustomError {
  // eslint-disable-next-line no-unused-vars
  constructor(private readonly message: string, private readonly status: number) {
    logger.error(message);
  }
}
