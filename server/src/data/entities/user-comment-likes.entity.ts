import { Column, Entity, ManyToOne } from 'typeorm';
import { ReactionType } from './../../common/enums/reaction-type.enum';
import { Comment } from './comment.entity';
import { User } from './user.entity';

@Entity('usercommentlikes')
export class UserCommentLikes {

  @Column({ type: 'tinyint', default: ReactionType.Like })
  reaction: ReactionType;

  @ManyToOne(() => User, (u) => u.commentLikes, { primary: true })
  user!: User;

  @ManyToOne(() => Comment, (c) => c.likes, { primary: true })
  comment!: Comment;
}
