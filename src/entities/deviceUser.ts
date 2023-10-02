import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DEVICE_USER } from "../commons/constants/db.constants";
import { User } from "./user";
import { Device } from "./device";

@Entity({ name: DEVICE_USER })
export class DeviceUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @CreateDateColumn()
  created_at: Date;

  @ManyToOne(() => Device, (device) => device.deviceUsers, {
    cascade: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "device_id" })
  device: Device;

  @ManyToOne(() => User, (user) => user.deviceUsers, {
    onDelete: "CASCADE",
    cascade: true,
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
