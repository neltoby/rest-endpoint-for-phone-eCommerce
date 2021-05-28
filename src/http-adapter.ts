import { Request, Response } from 'express';
import CustomError from './util/error/error.service';

export default (controller: Function) => (req: Request, res: Response) => {
  controller(req)
    .then((response: any) => {
      const { body } = response;
      res.json(body);
    })
    .catch((e: any) => {
      if (e instanceof CustomError) {
        res.status(500).json({ error: 'Server error' });
      }
    });
};
