import { LikeDTO } from '../models/post/like-dto';
import { ReturnMessageDTO } from './../models/common/return-message-dto';
import { ReturnPostDTO } from './../models/post/return-post-dto';
import { ReturnPostWithCommentsDTO } from './../models/post/return-post-with-comments-dto';
import { CreatePostDTO } from './../models/post/create-post-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { PostsService } from './posts.service';
import { Controller, Get, Post, UploadedFile, UseGuards, UseInterceptors, Body, ValidationPipe, Query, Param, ParseIntPipe, Put, Delete } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginationDTO } from 'src/models/common/pagination-dto';
import { InjectUser } from 'src/common/decorators/inject-user.decorator';
import { User } from 'src/data/entities/user.entity';

const multerSettings = {
  storage: diskStorage({
    destination: './upload',
    filename(req, file, callback) {
      const name = file.originalname.split('.')[0];
      const fileExtName = extname(file.originalname);
      const randomName = Array(16)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      callback(null, `${name}-${randomName}${fileExtName}`);
    },
  }),
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  }
};

@Controller('')
export class PostsController {
  constructor(
    private readonly postsService: PostsService
  ) { }
  
  @ApiTags('posts')
  @ApiBearerAuth()
  @ApiQuery({ type: PaginationDTO })
  @ApiResponse({ type: ReturnPostWithCommentsDTO, isArray: true })
  @Get('users/:id/posts')
  @UseGuards(JwtAuthGuard)
  public async getAllPosts(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PaginationDTO,
    @InjectUser() user: Partial<User>,
  ) {
    return this.postsService.getUsersPosts(user, id, +query.page, +query.count);
  }

  @ApiTags('posts')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnPostDTO })
  @Post('posts')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerSettings))
  public async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: CreatePostDTO,
    @InjectUser() user: Partial<User>,
  ) {
    return this.postsService.createPost(user, body, file?.filename);
  }

  @ApiTags('posts/reactions')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnMessageDTO })
  @Put('posts/:id/react')
  @UseGuards(JwtAuthGuard)
  public async reactToPost(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: LikeDTO,
    @InjectUser() user: Partial<User>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.postsService.reactToPost(user, id, body.reaction);

    return {
      message: 'Reaction updated!',
    };
  }

  @ApiTags('posts')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnPostWithCommentsDTO })
  @Get('posts/:id')
  @UseGuards(JwtAuthGuard)
  public async getPostById(
    @Param('id', ParseIntPipe) id: number,
    @InjectUser() user: Partial<User>
  ) {
    return this.postsService.getPostById(user, id);
  }

  @ApiTags('posts')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnPostDTO })
  @Put('posts/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerSettings))
  public async updatePost(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: CreatePostDTO,
    @InjectUser() user: Partial<User>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postsService.updatePost(user, id, body, file?.filename);
  }

  @ApiTags('posts')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnMessageDTO })
  @Delete('posts/:id')
  @UseGuards(JwtAuthGuard)
  public async deletePost(
    @InjectUser() user: Partial<User>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.postsService.deletePost(user, id);

    return {
      message: 'Post has been deleted!',
    };
  }
}
