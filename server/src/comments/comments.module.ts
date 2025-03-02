import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { User } from 'src/data/entities/user.entity';
import { UserPost } from 'src/data/entities/user-post.entity';
import { Comment } from 'src/data/entities/comment.entity';
import { UserPostLikes } from 'src/data/entities/user-post-likes.entity';
import { UserCommentLikes } from 'src/data/entities/user-comment-likes.entity';
import { UserConnection } from 'src/data/entities/user-connection.entity';
import { Token } from 'src/data/entities/token.entity';
import { TokenService } from 'src/token.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPost,
      Comment,
      UserPostLikes,
      UserCommentLikes,
      UserConnection,
      Token
    ]),
  ],
  providers: [
    CommentsService,
    TokenService,
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
