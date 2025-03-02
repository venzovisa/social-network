import { TokenService } from './../token.service';
import { Token } from './../data/entities/token.entity';
import { UserPost } from './../data/entities/user-post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from 'src/data/entities/user.entity';
import { Comment } from 'src/data/entities/comment.entity';
import { UserPostLikes } from 'src/data/entities/user-post-likes.entity';
import { UserCommentLikes } from 'src/data/entities/user-comment-likes.entity';
import { UserConnection } from 'src/data/entities/user-connection.entity';

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
  controllers: [UsersController],
  providers: [
    UsersService,
    TokenService,
  ],
})
export class UsersModule {}
