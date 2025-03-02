import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { User } from 'src/data/entities/user.entity';
import { UserPost } from 'src/data/entities/user-post.entity';
import { Comment } from 'src/data/entities/comment.entity';
import { UserPostLikes } from 'src/data/entities/user-post-likes.entity';
import { UserCommentLikes } from 'src/data/entities/user-comment-likes.entity';
import { UserConnection } from 'src/data/entities/user-connection.entity';
import { TokenService } from 'src/token.service';
import { Token } from 'src/data/entities/token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserPost,
      Comment,
      UserPostLikes,
      UserCommentLikes,
      UserConnection,
      Token,
    ]),
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    TokenService
  ],
})
export class PostsModule {}
