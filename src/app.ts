import express, { Express, NextFunction, Response } from "express";
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import { AppDataSource } from "./dbs/mysql.db";

import { SERVER_ERROR } from "./commons/constants/error.constants";
import { CustomError } from "./commons/myError";

import loginRoute from './routes/login.route'
import linkRoute from './routes/link.route'
import adminRoute from './routes/admin.route'

const app: Express = express();

// MIDDLEWARE
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONNECT DB
AppDataSource.initialize()
  .then(async () => {
    console.log("Mysql connected");
  })
  .catch((err) => console.log(err));

// ROUTE
app.use('/auth', loginRoute);
app.use('/link', linkRoute);
app.use('/admin', adminRoute)

// HANDLE ERROR
app.use((err: CustomError, _: any, res: Response, next: NextFunction) => {
    console.log("Error::: ", err)
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
      status: 'Error',
      code: err.code || SERVER_ERROR,
      message: err.message || 'Error!',
    });
  });
  

export default app;