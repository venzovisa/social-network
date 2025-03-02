import { ReturnUserWithFriendsDTO } from './../models/user/return-user-with-friends-dto';
import { BanUserDTO } from './../models/user/ban-user-dto';
import { JwtAuthGuard } from './../auth/jwt.guard';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDTO } from './../models/user/update-user-dto';
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UploadedFile, UseGuards, UseInterceptors, ValidationPipe, BadRequestException, Query } from '@nestjs/common';
import { CreateUserDTO } from 'src/models/user/create-user-dto';
import { UsersService } from './users.service';
import { ReturnUserDTO } from 'src/models/user/return-user-dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { InjectUser } from 'src/common/decorators/inject-user.decorator';
import { User } from 'src/data/entities/user.entity';
import { AdminGuard } from 'src/common/guards/admin.guard';
import { ReturnMessageDTO } from 'src/models/common/return-message-dto';
import { SearchUserDTO } from 'src/models/user/search-user-dto';

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

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) { }

  @ApiTags('users')
  @ApiQuery({ type: SearchUserDTO })
  @ApiResponse({ type: ReturnUserWithFriendsDTO, isArray: true })
  @Get()
  public async getAllUsers(@Query() query: SearchUserDTO) {
    return this.userService.getAllUsers(query.name, query.email, +query.page, +query.count);
  }

  @ApiTags('users')
  @ApiResponse({ type: ReturnUserWithFriendsDTO })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  public async getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUserById(id);
  }

  @ApiTags('users')
  @ApiResponse({ type: ReturnUserDTO })
  @Post()
  @UseInterceptors(FileInterceptor('file', multerSettings))
  public async createUser(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true, whitelist: true })) body: CreateUserDTO,
  ): Promise<ReturnUserDTO> {

    return this.userService.createUser(body, file?.filename);
  }

  @ApiTags('users')
  @ApiResponse({ type: ReturnUserDTO })
  @ApiBearerAuth()
  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', multerSettings))
  public async updateUser(
    @UploadedFile() file: Express.Multer.File,
    @Body(new ValidationPipe({ transform: true, whitelist: true })) body: UpdateUserDTO,
    @InjectUser() user: Partial<User>,
  ): Promise<ReturnUserDTO> {
    return this.userService.updateUser(user, body, file?.filename);
  }
  
  @ApiTags('users')
  @ApiResponse({ type: ReturnMessageDTO })
  @ApiBearerAuth()
  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  public async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @ApiTags('users')
  @ApiResponse({ type: ReturnUserDTO })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Post(':id/ban')
  public async banUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe({ whitelist: true, transform: true })) body: BanUserDTO,
  ) {
    return this.userService.banUser(id, body.reason, body.period);
  }

  @ApiTags('users/friends')
  @ApiResponse({ type: ReturnMessageDTO })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post(':id/friends/:toId')
  public async addFriend(
    @Param('id', ParseIntPipe) id: number,
    @Param('toId', ParseIntPipe) toId: number,
    @InjectUser() user: Partial<User>,
  ) {
    if (user.id !== id) {
      throw new BadRequestException('Malformed request URL!');
    }

    return this.userService.addFriend(id, toId);
  }

  @ApiTags('users/friends')
  @ApiResponse({ type: ReturnMessageDTO })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id/friends/:toId')
  public async confirmFriendship(
    @Param('id', ParseIntPipe) id: number,
    @Param('toId', ParseIntPipe) toId: number,
    @InjectUser() user: Partial<User>,
  ) {
    if (user.id !== id) {
      throw new BadRequestException('Malformed request URL!');
    }

    return this.userService.acceptFriendRequest(user, toId);
  }

  @ApiTags('users/friends')
  @ApiResponse({ type: ReturnMessageDTO })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id/friends/:toId')
  public async deleteFriend(
    @Param('id', ParseIntPipe) id: number,
    @Param('toId', ParseIntPipe) toId: number,
    @InjectUser() user: Partial<User>,
  ) {
    if (user.id !== id) {
      throw new BadRequestException('Malformed request URL!');
    }

    return this.userService.deleteFriendRequest(user, toId);
  }
}
