/* eslint-disable class-methods-use-this */
import redis from 'redis';
import { promisify } from 'util';
import { ErrorCodes, ICacheVariable } from '../../interfaces/interfaces';

import CustomError from '../error/error.service';
import logger from '../logger';

class RedisClient {
  static client: any;

  static connection = false;

  client: any;

  constructor() {
    this.client = this.createRedisClient();
  }

  createRedisClient() {
    if (RedisClient.client === undefined) {
      RedisClient.client = redis.createClient({
        host: process.env.REDIS_HOSTNAME,
        port: parseInt(process.env.REDIS_PORT, 10),
        password: process.env.REDIS_PASSWORD,
      });

      RedisClient.client.on('ready', async () => {
        RedisClient.connection = true;
        logger.log(`${new Date()} - redis.connection.ready`);
      });

      RedisClient.client.on('connect', async () => {
        logger.log(`${new Date()} - redis.connection.connected`);
      });

      RedisClient.client.on('error', (err: any) => {
        logger.error(`${new Date()} - redis.connection.failed :::: ${err.message}`);
      });
      return RedisClient.client;
    }
    return RedisClient.client;
  }

  async cacheVariable(cacheVariables: ICacheVariable) {
    const { varName, varValue } = cacheVariables;
    const setAsync = promisify(RedisClient.client.setex).bind(RedisClient.client);
    if (!varName) {
      logger.error(`${new Date()} :::: cacheVariable function :::: varName is missing`);
      throw new CustomError(
        'Could not save to cache - varName is missing.',
        ErrorCodes.INTERNAL_SERVER_ERORR,
      );
    }
    if (!varValue) {
      logger.error(`${new Date()} :::: cacheVariable function :::: varValue is missing`);
      throw new CustomError(
        'Could not save to cache - varValue is missing.',
        ErrorCodes.INTERNAL_SERVER_ERORR,
      );
    }
    const cached = await setAsync(varName, 3600, JSON.stringify(varValue));
    logger.log(
      `${new Date()} :::: cacheVariable function :::: varName: ${varName} :::: varValue: ${varValue}`,
    );
    if (cached === 'OK') {
      logger.log(`${new Date()} :::: cacheVariable function :::: caching was succesfull`);
      return {
        action: 'caching',
        success: true,
        message: 'caching was succesfull',
      };
    }
    logger.log(`${new Date()} :::: cacheVariable function :::: caching was not succesfull`);
    return {
      action: 'caching',
      success: false,
      message: 'caching was not succesfull',
    };
  }

  async getVariable(varName: string) {
    const getAsync = promisify(RedisClient.client.get).bind(RedisClient.client);
    if (!varName) {
      logger.error(`${new Date()} :::: getVariable method :::: varName is missing`);
      throw new CustomError(
        'Could not save to cache - varName is missing.',
        ErrorCodes.INTERNAL_SERVER_ERORR,
      );
    }
    logger.log(
      `${new Date()} :::: getVariable method :::: client.get method :::: varName :::: ${varName}`,
    );
    const getResponse = await getAsync(varName);
    if (getResponse) {
      logger.log(
        `${new Date()} :::: getVariable method :::: client.get method :::: response exist`,
      );
      return {
        action: 'get_cache',
        success: true,
        message: 'cached value exist',
        value: JSON.parse(getResponse),
      };
    }
    logger.log(
      `${new Date()} :::: getVariable method :::: client.get method :::: response do not exist`,
    );
    return {
      action: 'get_cache',
      success: false,
      message: 'cached value does not exist',
    };
  }
}
const redisClient = new RedisClient();
const cacheVariable = redisClient.cacheVariable.bind(redisClient);
const getVariable = redisClient.getVariable.bind(redisClient);
export {
  redisClient as default, cacheVariable, getVariable, RedisClient,
};
