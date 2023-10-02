import { NextFunction, Request, Response } from "express";
import { CreateLinkReq, DelLinkReq } from "../commons/interfaces";
import { AppDataSource } from "../dbs/mysql.db";
import { User } from "../entities/user";
import {
  INTERNAL_SERVER_ERROR,
  LINK_FAIL_ERROR,
  NOT_FOUND_ERROR,
  USER_NOT_FOUND_ERROR,
} from "../commons/myError";
import { Link } from "../entities/link";
import { SUCCESSED } from "../commons/reponse";

const linkDataSource = AppDataSource.getRepository(Link);

export class LinkController {
  static async createLink(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as CreateLinkReq;
      const { uid, ltp, lid } = body;
      const userPromise = User.findOne({ where: { id: uid }, select: ["id"] });

      const linkForLIDPromise = linkDataSource
        .createQueryBuilder("link")
        .select()
        .leftJoinAndSelect("link.user", "user")
        .where("link.typ = :typ", { typ: ltp.toString() })
        .andWhere("link.lid = :lid", { lid: lid })
        .getOne();

      const linkForUIDPromise = linkDataSource
        .createQueryBuilder("link")
        .select()
        .leftJoinAndSelect("link.user", "user")
        .where("link.typ = :lid", { lid: lid })
        .andWhere("link.user_id = :uid", { uid: uid })
        .getOne();

      const [user, linkForLID, linkForUID] = await Promise.all([
        userPromise,
        linkForLIDPromise,
        linkForUIDPromise,
      ]);

      if (!user) throw new USER_NOT_FOUND_ERROR();

      // If link not exist then create;
      if (!linkForLID && !linkForUID) {
        const link = new Link();
        link.user = user;
        link.typ = ltp;
        link.lid = lid;
        await AppDataSource.manager.save(link);

        return new SUCCESSED().sender(res);
      }
      // If link exist in DB
      else if (
        (linkForLID && linkForLID.lid === lid) ||
        (linkForUID && linkForUID.user.id === uid)
      ) {
        return new SUCCESSED().sender(res);
      }
      // Error
      else throw new INTERNAL_SERVER_ERROR();
    } catch (error) {
      next(error);
    }
  }

  static async unLink(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as DelLinkReq;
      const { uid, lid, ltp } = body;
      const resData = await linkDataSource
        .createQueryBuilder()
        .delete()
        .where("user_id = :uid", { uid })
        .andWhere("lid = :lid", { lid })
        .andWhere("typ = :ltp", { ltp })
        .execute();
      if (resData.affected === 1) return new SUCCESSED().sender(res);
      else throw new LINK_FAIL_ERROR();
    } catch (error) {
      next(error);
    }
  }

  static async getAllLinkOfUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const uid: string = req.body.uid;
      const user = User.findOne({ where: { id: uid } });
      if (!user) throw new NOT_FOUND_ERROR();

      const links = await linkDataSource
        .createQueryBuilder()
        .select(["link.typ", "link.lid"])
        .where("link.user_id = :uid", { uid: uid })
        .getMany();

      return new SUCCESSED(links).sender(res);
    } catch (error) {
      next(error);
    }
  }
}
