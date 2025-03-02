import { UserPost } from './user-post.entity';
import { UserConnection } from './user-connection.entity';
import { UserRole } from './../../common/enums/user-role.enum';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Comment } from './comment.entity';
import { UserPostLikes } from './user-post-likes.entity';
import { UserCommentLikes } from './user-comment-likes.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'nvarchar', unique: true, nullable: false })
  username: string;

  @Column({ type: 'nvarchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'nvarchar', nullable: false })
  password: string;

  @Column({ type: 'tinyint', default: UserRole.Basic })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true, default: 'default.png' })
  avatar: string;

  @Column({ nullable: true })
  banDate: Date;

  @Column({ type: 'nvarchar', nullable: true })
  banReason: string;

  @UpdateDateColumn()
  lastUpdated: Date;

  @Column({ type: 'double', nullable: true })
  latitude: number;

  @Column({ type: 'double', nullable: true })
  longitude: number;

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean;

  // Relations

  @OneToMany(() => UserConnection, (c) => c.requestedBy)
  requestedConnections!: UserConnection[];

  @OneToMany(() => UserConnection, (c) => c.requestedFor)
  requestsFromConnections!: UserConnection[];

  @OneToMany(() => UserPost, (p) => p.author)
  posts!: UserPost[];

  @OneToMany(() => Comment, (c) => c.author)
  comments!: Comment[];

  @OneToMany(() => UserPostLikes, (u) => u.user)
  postLikes!: UserPostLikes[];

  @OneToMany(() => UserCommentLikes, (u) => u.user)
  commentLikes!: UserCommentLikes[];
}
