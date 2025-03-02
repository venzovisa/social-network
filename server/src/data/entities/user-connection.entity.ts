import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ConnectionStatus } from './../../common/enums/connection-status.enum';
import { User } from './user.entity';

@Entity('connections')
export class UserConnection {
  @PrimaryGeneratedColumn()
  userToUserId: number;

  @UpdateDateColumn()
  updatedOn: Date;

  @ManyToOne(() => User, (user) => user.requestedConnections)
  requestedBy!: User;

  @ManyToOne(() => User, (user) => user.requestsFromConnections)
  requestedFor!: User;

  @Column({ type: 'tinyint', default: ConnectionStatus.Sent })
  status: ConnectionStatus;
}
