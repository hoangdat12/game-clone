import { SUCCESS } from "./constants";
import {Response as ExpressResponse} from 'express'

export abstract class Response {
    readonly status: number;
    readonly code :string; 
    readonly message: string;
    readonly metaData: any

    constructor(status: number, code: string, message: string, metaData: any) {
        this.status = status;
        this.code = code;
        this.metaData = metaData;
        this.message = message;
    }

    abstract sender(res: ExpressResponse): void;
}

export class SUCCESSED extends Response {
    constructor(metaData?: any, message?: string) {
        super(200, SUCCESS, message || "Successfully!", metaData);
    }

    sender(res: ExpressResponse<any, Record<string, any>>) {
        return res.status(this.status).json(this)
    }
}