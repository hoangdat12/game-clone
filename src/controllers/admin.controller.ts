import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../dbs/mysql.db";
import { User } from "../entities/user";
import { SUCCESSED } from "../commons/reponse";
import { INTERNAL_SERVER_ERROR, NOT_PERMISSION } from "../commons/myError";
import { Device } from "../entities/device";

export class AdminController {
  static async getAllUserIDs(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const sortedBy = req.query.sortedBy || "ctime";

      const offset = (page - 1) * pageSize;

      const users = await AppDataSource.getRepository(User)
        .createQueryBuilder()
        .select("id")
        .where("id NOT LIKE 'fake%'")
        .andWhere("LENGTH(id) >= 20")
        .orderBy("created_at", sortedBy === "ctime" ? "ASC" : "DESC")
        .skip(offset)
        .take(pageSize)
        .getRawMany();

      return new SUCCESSED(users).sender(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUserFromDate(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const sortedBy = req.query.sortedBy || "ctime";

      const offset = (page - 1) * pageSize;

      const fdt: string = req.body.fdt;
      const date: string[] = fdt.split("/");
      if (date.length !== 3) throw new INTERNAL_SERVER_ERROR();

      const dateFormat = `${date[2]}-${date[1].padStart(
        2,
        "0"
      )}-${date[0].padStart(2, "0")}`;

      const users = await AppDataSource.getRepository(User)
        .createQueryBuilder("user")
        .select("user.id AS id")
        .where("user.created_at > :from_date", {
          from_date: dateFormat,
        })
        .andWhere("id NOT LIKE 'fake%'")
        .andWhere("LENGTH(id) >= 20")
        .orderBy("created_at", sortedBy === "ctime" ? "ASC" : "DESC")
        .skip(offset)
        .take(pageSize)
        .getRawMany();

      return new SUCCESSED(users).sender(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllDeviceIDs(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const sortedBy = req.query.sortedBy || "ctime";

      const offset = (page - 1) * pageSize;

      const devices = await AppDataSource.getRepository(Device)
        .createQueryBuilder("device")
        .orderBy("created_at", sortedBy === "ctime" ? "ASC" : "DESC")
        .skip(offset)
        .take(pageSize)
        .getMany();

      const deviceIDs = devices?.map((device) => {
        return device.id;
      });
      return new SUCCESSED(deviceIDs).sender(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllUserData(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 20;
      const sortedBy = req.query.sortedBy || "ctime";

      const offset = (page - 1) * pageSize;

      const users = await AppDataSource.getRepository(User)
        .createQueryBuilder()
        .select(["id", "keyValues"])
        .andWhere("id NOT LIKE 'fake%'")
        .andWhere("LENGTH(id) >= 20")
        .orderBy("created_at", sortedBy === "ctime" ? "ASC" : "DESC")
        .skip(offset)
        .take(pageSize)
        .getRawMany();

      return new SUCCESSED(users).sender(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllDeviceData(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const devices = await Device.find({
        relations: {
          deviceUsers: {
            user: true,
          },
        },
      });
      const result = devices.map((device) => {
        const deviceData = Object.fromEntries(
          Object.entries(device).filter(([key, value]) => value !== null)
        );
        const { deviceUsers, ...deviceInfo } = deviceData;
        const userIDs = deviceUsers.map((du: any) => du.user.id);
        return {
          ...deviceInfo,
          uids: [...userIDs],
          user_cnt: userIDs.length,
        };
      });
      return new SUCCESSED(result).sender(res);
    } catch (error) {
      next(error);
    }
  }

  static async getAllDeviceDataV2(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const devices = await Device.createQueryBuilder("device")
        .leftJoinAndSelect("device.deviceUsers", "deviceUser")
        .leftJoinAndSelect("deviceUser.user", "user")
        .getMany();

      const result = devices.map((device) => ({
        ...device,
        uids: device.deviceUsers.map((deviceUser) => deviceUser.user.id),
        user_cnt: device.deviceUsers.length,
        deviceUsers: undefined,
      }));

      return new SUCCESSED(result).sender(res);
    } catch (error) {
      next(error);
    }
  }
}
