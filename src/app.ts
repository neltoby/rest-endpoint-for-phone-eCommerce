/* eslint-disable linebreak-style */
/* eslint-disable no-underscore-dangle */
/* eslint-disable linebreak-style */
import express, { Express, Request, Response } from 'express';
import { API_ROUTE } from './constants';
import httpAdapter from './http-adapter';
import syncData from './sync-data/sync-data.controller';
import DatabaseService from './model/db/db.service';
import getReqData from './get-request/get-request.controller';
import searchReq from './search-request/search-request.controller';
import category from './category/category.controller';

export default class App {
  private _app: Express;

  private dbConn: DatabaseService;

  constructor() {
    this._app = express();
    this.dbConn = new DatabaseService();
    this.setPort();
    this.middleWare();
    this.routes();
  }

  setPort() {
    const port = process.env.PORT || 5000;
    this.app.set('port', port);
  }

  get app() {
    return this._app;
  }

  routes() {
    this.app.get(`/${API_ROUTE}`, httpAdapter(getReqData));
    this.app.get(`/${API_ROUTE}/sync-data`, httpAdapter(syncData));
    this.app.get(`/${API_ROUTE}/search`, httpAdapter(searchReq));
    this.app.get(`/${API_ROUTE}/category/:category`, httpAdapter(category));
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Hello world');
    });
  }

  middleWare() {
    this.app.use(express.json());
    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', 'https://eze-store.herokuapp.com');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      next();
    });
  }
}
