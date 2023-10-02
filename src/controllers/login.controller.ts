import { Request, Response, NextFunction } from "express";
import { LoginDeviceReq, LoginLinkReq } from "../commons/interfaces/index";
import { AppDataSource } from "../dbs/mysql.db";
import { Device } from "../entities/device";
import { SUCCESSED } from "../commons/reponse";
import { User } from "../entities/user";
import { LoginService } from "../services/login.server";
import { DeviceUser } from "../entities/deviceUser";
import { NOT_FOUND_ERROR } from "../commons/myError";
import { Link } from "../entities/link";

export class LoginController {
  // First login
  static async loginWithDevice(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = req.body as LoginDeviceReq;
      const { did, plf, lan } = data;

      // Handle device ID
      let deviceID = did[0] === "_" ? did.substring(1) : did;
      if (deviceID.length < 16) deviceID = deviceID.padEnd(16, deviceID[0]);

      // Get device
      const device = await AppDataSource.getRepository(Device).findOne({
        where: { id: did },
        relations: {
          deviceUsers: {
            user: true,
          },
        },
      });

      // Create new User
      const user = new User();
      user.id = LoginService.initUserId(
        deviceID,
        plf,
        device ? device.deviceUsers.length % 62 : 0,
        did[0] === "_"
      );
      user.keyValues = { pla: plf };

      if (device) {
        device.language = lan;
        device.platform = plf;
        const deviceUser = new DeviceUser();

        deviceUser.user = user;
        deviceUser.device = device;
        await AppDataSource.manager.save(deviceUser);
      } else {
        const newDevice = new Device();
        newDevice.id = did;
        newDevice.language = lan;
        newDevice.platform = plf;

        const deviceUser = new DeviceUser();
        deviceUser.user = user;
        deviceUser.device = newDevice;
        await AppDataSource.manager.save(deviceUser);
      }

      return new SUCCESSED(user.id).sender(res);
    } catch (err) {
      next(err);
    }
  }

  static async loginWithUserId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid = req.body.uid as string;
      const user = await User.findOne({
        where: {
          id: uid,
        },
      });
      if (!user) throw new NOT_FOUND_ERROR();
      return new SUCCESSED(user).sender(res);
    } catch (error) {
      next(error);
    }
  }

  static async loginWithLink(req: Request, res: Response, next: NextFunction) {
    try {
      const { lid, ltp } = req.body as LoginLinkReq;
      const link = await AppDataSource.getRepository(Link)
        .createQueryBuilder("link")
        .leftJoinAndSelect("link.user", "user")
        .where("link.lid = :lid", { lid: lid })
        .andWhere("link.typ = :typ", { typ: ltp })
        .getOne();
      if (!link) throw new NOT_FOUND_ERROR();
      return new SUCCESSED(link).sender(res);
    } catch (error) {
      next(error);
    }
  }
}
