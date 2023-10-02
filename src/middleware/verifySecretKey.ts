import { NextFunction, Request, Response } from "express"
import { NOT_PERMISSION } from "../commons/myError";


export const verifySecretKey = (req: Request, res: Response, next: NextFunction) => {
    const keySecret = req.headers['key-secret'];
    if (keySecret !== 'ADMIN') throw new NOT_PERMISSION();
    
   next();
}