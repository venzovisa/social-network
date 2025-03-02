import { Column, Entity, ManyToOne } from 'typeorm';
import { ReactionType } from './../../common/enums/reaction-type.enum';
import { UserPost } from './user-post.entity';
import { User } from './user.entity';

@Entity('userpostlikes')
export class UserPostLikes {

  @ManyToOne(() => User, (u) => u.postLikes, { primary: true })
  user!: User;

  @ManyToOne(() => UserPost, (u) => u.likes, { primary: true })
  post!: UserPost;

  @Column({ type: 'tinyint', default: ReactionType.Like })
  reaction: ReactionType;
}
