import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../../util/logger';

dotenv.config();

export default class DatabaseService {
  static connection = 'Initializing connection';

  private connection: any;

  constructor() {
    this.connection = this.getConnecionInstance();
  }

  getConnecionInstance() {
    if (DatabaseService.connection !== 'connected') {
      logger.log(DatabaseService.connection);
      this.makeConnection().then((res) => {
        DatabaseService.connection = 'connected';
        logger.log('Database connected');
        return DatabaseService.connection;
      });
    }
    return DatabaseService.connection;
  }

  // eslint-disable-next-line class-methods-use-this
  async makeConnection() {
    try {
      logger.log('Connecting to database ...');
      await mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
    } catch (e) {
      logger.log('Failed to connect to database');
      logger.error(e);
    }
  }
}
