import { Request, Response, NextFunction } from 'express';

const asyncHandler = (fnc: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fnc(req, res, next).catch(next);
  };
};

export default asyncHandler;
