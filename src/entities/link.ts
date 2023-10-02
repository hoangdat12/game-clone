import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { LINK_DATA } from "../commons/constants";
import { User } from "./user";

export enum LinkType {
  FacebookAndroid = 1,
  FacebookIOS,
  GooglePlay,
  GameCenter,
  AppleApp,
}
@Entity(LINK_DATA) //table name
export class Link extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  lid: string;

  @Column({ nullable: false, type: "enum", enum: LinkType })
  typ: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.links, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
