import { UserPost } from 'src/data/entities/user-post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserCommentLikes } from './user-comment-likes.entity';
import { User } from './user.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'varchar', nullable: true })
  picture: string;

  @Column({ type: 'text', nullable: true })
  embed: string;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  @Column({ type: 'tinyint', default: false })
  isDeleted: boolean;

  // Relations

  @ManyToOne(() => User, (u) => u.comments)
  author!: User;

  @OneToMany(() => UserCommentLikes, (u) => u.comment)
  likes!: UserCommentLikes[];

  @ManyToOne(() => UserPost, (p) => p.comments)
  post!: UserPost;
}
