import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { User } from 'src/data/entities/user.entity';
import { UserPost } from 'src/data/entities/user-post.entity';
import { Comment } from 'src/data/entities/comment.entity';
import { Token } from 'src/data/entities/token.entity';
import { TokenService } from 'src/token.service';
import { UserConnection } from 'src/data/entities/user-connection.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      UserConnection,
      UserPost,
      Comment,
      Token,
    ]),
  ],
  controllers: [FeedController],
  providers: [
    FeedService,
    TokenService,
  ],
})
export class FeedModule {}
