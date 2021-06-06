import winston, { Logger, format, transports } from 'winston';

export default class LoggerService {
  private static loggerInstance: Logger;

  private logger: Logger;

  constructor() {
    this.logger = this.getLoggerInstance();
  }

  // eslint-disable-next-line class-methods-use-this
  private getLoggerInstance(): Logger {
    if (!LoggerService.loggerInstance) {
      this.makeLogger();
    }
    return LoggerService.loggerInstance;
  }

  // eslint-disable-next-line class-methods-use-this
  private makeLogger() {
    LoggerService.loggerInstance = winston.createLogger({
      transports: [
        // new transports.File({
        //   filename: 'error.log',
        //   level: 'error',
        //   format: format.json(),
        // }),
        new transports.Console({
          level: 'info',
          format: format.combine(format.colorize(), format.simple()),
        }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(`${new Date()} --- ${message}`);
  }

  error(message: string) {
    this.logger.error({
      level: 'error',
      message: `Error - ${new Date()} --- ${message}`,
    });
  }
}
