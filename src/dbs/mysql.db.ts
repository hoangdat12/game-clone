import { DataSource } from "typeorm";
import { User } from "../entities/user";
import { Device } from "../entities/device";
import { DeviceUser } from "../entities/deviceUser";

import * as dotenv from 'dotenv';
import { Link } from "../entities/link";

dotenv.config()
export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    timezone: "Z",
    synchronize: true,
    entities: [
      User,
      Device,
      DeviceUser,
      Link
    ],
    subscribers: [],
    migrations: ["dist/dbs/migrations/*.js"],
  });