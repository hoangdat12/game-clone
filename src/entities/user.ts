import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BaseEntity,
} from 'typeorm';
import { USER_DATA } from '../commons/constants/db.constants';
import { DeviceUser } from './deviceUser';
import { Link } from './link';

@Entity(USER_DATA)
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'json', nullable: true })
  keyValues: Record<string, any>;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn({ select: false })
  updated_at: Date;

  @OneToMany(() => DeviceUser, (deviceUsers) => deviceUsers.user)
  deviceUsers: DeviceUser[];

  @OneToMany(() => Link, (link) => link.user)
  links: Link[];
}
