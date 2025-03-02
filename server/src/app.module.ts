import { User } from './data/entities/user.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TokenService } from './token.service';
import { UserPost } from './data/entities/user-post.entity';
import { Comment } from './data/entities/comment.entity';
import { UserPostLikes } from './data/entities/user-post-likes.entity';
import { UserCommentLikes } from './data/entities/user-comment-likes.entity';
import { UserConnection } from './data/entities/user-connection.entity';
import { Token } from './data/entities/token.entity';
import { FeedModule } from './feed/feed.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // real sql connection settings

      // type: 'mariadb',
      // host: 'localhost',
      // port: 3306,
      // username: 'root',
      // password: '1234',
      // database: 'network',

      // built-in sqlite3 connection settings

      type: 'sqlite',
      database: './data/data.sql',

      // orm configuration features
      synchronize: true,
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      migrations: ['src/data/migration/**/*.{ts,js}'],
    }),
    TypeOrmModule.forFeature([User, UserPost, Comment, UserPostLikes, UserCommentLikes, UserConnection, Token]),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'upload'),
      // serveRoot: '/images',
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    FeedModule,
  ],
  controllers: [],
  providers: [
    TokenService,
  ],
  exports: [TokenService],
})
export class AppModule {}
