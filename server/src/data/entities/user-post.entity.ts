import { User } from './user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserPostLikes } from './user-post-likes.entity';
import { Comment } from './comment.entity';

@Entity('posts')
export class UserPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  picture: string;

  @Column({ type: 'text', nullable: true })
  embed: string;

  @Column({ type: 'double', nullable: true })
  latitude: number;

  @Column({ type: 'double', nullable: true })
  longitude: number;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean;

  @Column({ type: 'tinyint', default: true })
  isPublic: boolean;

  // Relations
  @ManyToOne(() => User, (u) => u.posts)
  author!: User;

  @OneToMany(() => UserPostLikes, (u) => u.post)
  likes!: UserPostLikes[];

  @OneToMany(() => Comment, (c) => c.post)
  comments!: Comment[];
}
