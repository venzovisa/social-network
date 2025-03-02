import { LikeDTO } from './../models/post/like-dto';
import { ReturnMessageDTO } from 'src/models/common/return-message-dto';
import { CreateCommentDTO } from 'src/models/comment/create-comment-dto';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { ReturnCommentWithLikesDTO } from './../models/comment/return-comment-with-likes-dto';
import { CommentsService } from './comments.service';
import { Controller, Get, Param, UseGuards, ParseIntPipe, Post, UseInterceptors, UploadedFile, Body, ValidationPipe, Put, Delete } from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { InjectUser } from 'src/common/decorators/inject-user.decorator';
import { User } from 'src/data/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';

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
export class CommentsController {
  constructor(
    private readonly commentService: CommentsService,
  ) { }
  
  @ApiTags('comments')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnCommentWithLikesDTO, isArray: true })
  @UseGuards(JwtAuthGuard)
  @Get('users/:id/comments')
  public async getUsersComments(
    @InjectUser() user: Partial<User>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentService.getUserComments(user, id);
  }
  
  @ApiTags('comments')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnCommentWithLikesDTO })
  @Post('posts/:id/comments')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerSettings))
  public async createComment(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: CreateCommentDTO,
    @InjectUser() user: Partial<User>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentService.createComment(user, id, body, file?.filename);
  }

  @ApiTags('comments')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnCommentWithLikesDTO })
  @Put('comments/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerSettings))
  public async updateComment(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: CreateCommentDTO,
    @InjectUser() user: Partial<User>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.commentService.updateComment(user, id, body, file?.filename);
  }

  @ApiTags('comments')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnMessageDTO })
  @Delete('comments/:id')
  @UseGuards(JwtAuthGuard)
  public async deleteComment(
    @InjectUser() user: Partial<User>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.commentService.deleteComment(user, id);

    return {
      message: 'Comment has been deleted!',
    };
  }

  @ApiTags('comments/reactions')
  @ApiBearerAuth()
  @ApiResponse({ type: ReturnMessageDTO })
  @Put('comments/:id/react')
  @UseGuards(JwtAuthGuard)
  public async reactToComment(
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: LikeDTO,
    @InjectUser() user: Partial<User>,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.commentService.reactToComment(user, id, body.reaction);

    return {
      message: 'Reaction updated!',
    };
  }
}
