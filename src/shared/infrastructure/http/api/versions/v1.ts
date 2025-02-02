import { Router, type Request, type Response } from 'express';

const v1Router = Router();

v1Router.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Uni-traffic Backend API v1' });
});

export { v1Router };