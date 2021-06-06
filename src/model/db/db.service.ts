import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from '../../util/logger';
import sellRequestSchema from '../schema/sellRequest';
import buyRequestSchema from '../schema/buyRequest';

dotenv.config();

export default class DatabaseService {
  static connection = 'Initializing connection';

  static conn: any;

  conn: any;

  public BuyRequest: any;

  public SellRequest: any;

  constructor() {
    this.conn = this.getConnecionInstance();
  }

  async getConnecionInstance() {
    if (DatabaseService.connection !== 'connected') {
      logger.log(DatabaseService.connection);
      await this.makeConnection();
    } else {
      this.BuyRequest = DatabaseService.conn.model('BuyRequest', buyRequestSchema);
      this.SellRequest = DatabaseService.conn.model('SellRequest', sellRequestSchema);
    }
  }

  // eslint-disable-next-line class-methods-use-this
  async makeConnection() {
    // try {
    const conn = mongoose.createConnection(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    conn.on('connecting', () => {
      logger.log('Database connecting');
    });
    conn.on('connected', () => {
      DatabaseService.connection = 'connected';
      DatabaseService.conn = conn;
      this.BuyRequest = conn.model('BuyRequest', buyRequestSchema);
      this.SellRequest = conn.model('SellRequest', sellRequestSchema);
      logger.log('Database is connected');
    });
    conn.on('disconnected', () => {
      logger.log('Database disconnected');
    });
    conn.on('error', (err) => {
      logger.error(err);
    });

    // } catch (e) {
    //   logger.log('Failed to connect to database');
    //   logger.error(e);
    // }
  }
}

// const dbConn = new DatabaseService();
// export { dbConn };
