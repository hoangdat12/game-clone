import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { DeviceUser } from "./deviceUser";
import { DEVICE_DATA } from "../commons/constants/db.constants";

@Entity(DEVICE_DATA) //table name
export class Device extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  language: string;

  @Column({ nullable: true })
  operatingSystem: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: true })
  UI: string;

  @Column({ nullable: false })
  platform: string;

  @CreateDateColumn({ select: false })
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @OneToMany(() => DeviceUser, (deviceUsers) => deviceUsers.device)
  deviceUsers: DeviceUser[];
}
