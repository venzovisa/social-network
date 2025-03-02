import { ConnectionStatus } from './../common/enums/connection-status.enum';
import { UpdateUserDTO } from './../models/user/update-user-dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/data/entities/comment.entity';
import { UserCommentLikes } from 'src/data/entities/user-comment-likes.entity';
import { UserConnection } from 'src/data/entities/user-connection.entity';
import { UserPostLikes } from 'src/data/entities/user-post-likes.entity';
import { UserPost } from 'src/data/entities/user-post.entity';
import { User } from 'src/data/entities/user.entity';
import { CreateUserDTO } from 'src/models/user/create-user-dto';
import { FindConditions, Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { toSingleUser, toUserWithFriends } from 'src/utils/transformer';
import { UserRole } from 'src/common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserConnection)
    private readonly userConnectionsRepository: Repository<UserConnection>,
    @InjectRepository(UserPost)
    private readonly postRepository: Repository<UserPost>,
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    @InjectRepository(UserPostLikes)
    private readonly userPostLikeRepository: Repository<UserPostLikes>,
    @InjectRepository(UserCommentLikes)
    private readonly userCommentLikeRepository: Repository<UserCommentLikes>,
  ) { }

  public async getAllUsers(username = '', email = '', page: number, count: number) {
    if (Number.isNaN(page)) {
      page = 0;
    }
    if (Number.isNaN(count)) {
      count = 20;
    }

    const findConditions: FindConditions<User> = {
      isDeleted: false,
    };

    if (username) {
      findConditions.username = Like(`%${username}%`);
    }
    
    if (email) {
      findConditions.email = Like(`%${email}%`);
    }

    const users = await this.userRepository.find({
      where: findConditions,
      skip: page * count,
      take: count,
      relations: [
        'requestedConnections',
        'requestedConnections.requestedFor',
        'requestsFromConnections',
        'requestsFromConnections.requestedBy',
      ],
    });

    return users.map(toUserWithFriends);
  }
  
  public async getUserById(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: [
        'requestedConnections',
        'requestedConnections.requestedFor',
        'requestsFromConnections',
        'requestsFromConnections.requestedBy',
      ],
    });

    if (!user) {
      throw new BadRequestException('User does not exist!');
    }

    return toUserWithFriends(user);
  }

  public async createUser(userBody: CreateUserDTO, avatar?: string) {
    const userToCreate = this.userRepository.create(userBody);

    userToCreate.password = await bcrypt.hash(userToCreate.password, 10);

    // userToCreate.role = UserRole.Admin;

    if (avatar) {
      userToCreate.avatar = avatar;
    }

    try {
      const user = await this.userRepository.save(userToCreate);

      return toSingleUser(user);
    } catch (e) {
      throw new BadRequestException('Cannot create user profile.');
    }
  }

  public async updateUser(user: Partial<User>, userBody: UpdateUserDTO, avatar?: string) {
    const userToUpdate = await this.userRepository.findOne({ id: user.id, isDeleted: false });

    if (!userToUpdate) {
      throw new NotFoundException('User does not exist!');
    }

    if (avatar) {
      userToUpdate.avatar = avatar;
    }

    if (userBody.newPassword) {
      if (!userBody.password) {
        throw new BadRequestException('Confirmation password expected!');
      }

      if (userBody.password === userBody.newPassword) {
        throw new BadRequestException('Please provide a new password different from the old one!');
      }

      if (! await bcrypt.compare(userBody.password, userToUpdate.password)) {
        throw new BadRequestException('Passwords do not match!');
      }

      userBody.password = await bcrypt.hash(userBody.newPassword, 10);
    }

    const updatedUser = await this.userRepository.save({
      ...userToUpdate,
      ...userBody,
    });

    return toSingleUser(updatedUser);
  }

  public async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ id, isDeleted: false });

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    // TODO: delete all user posts and comments
    user.isDeleted = true;
    await this.userRepository.save(user);

    return toSingleUser(user);
  }

  public async banUser(id: number, reason: string, period: number) {
    const user = await this.userRepository.findOne({ id, isDeleted: false });

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    user.banReason = reason;
    user.banDate = new Date(Date.now() + period * 1000);

    await this.userRepository.save(user);

    return toSingleUser(user);
  }

  public async addFriend(fromUserId: number, toUserId: number) {
    if (fromUserId === toUserId) {
      throw new BadRequestException('Feeling lonely, are we?');
    }

    const fromUser = await this.userRepository.findOne({ id: fromUserId, isDeleted: false });
    const toUser = await this.userRepository.findOne({ id: toUserId, isDeleted: false });

    if (!fromUser || !toUser) {
      throw new NotFoundException('User does not exist!');
    }

    const connection1 = await this.userConnectionsRepository.findOne({ requestedBy: fromUser, requestedFor: toUser });
    const connection2 = await this.userConnectionsRepository.findOne({ requestedBy: toUser, requestedFor: fromUser });

    if (connection1) {
      return { message: 'You have already requested friendship!' };
    }

    if (connection2) {
      if (connection2.status === ConnectionStatus.Approved) {
        return { message: 'You are already friends!' };
      }

      connection2.status = ConnectionStatus.Approved;
      await this.userConnectionsRepository.save(connection2);

      return { message: `You are now friends with ${toUser.username}!` };
    }

    const connection = this.userConnectionsRepository.create({ requestedBy: fromUser, requestedFor: toUser });
    await this.userConnectionsRepository.save(connection);

    return { message: 'Request has been sent!' };
  }

  public async acceptFriendRequest(user: Partial<User>, id) {
    const fromUser = await this.userRepository.findOne({ id: user.id, isDeleted: false });
    const toUser = await this.userRepository.findOne({ id, isDeleted: false });

    if (!fromUser || !toUser) {
      throw new NotFoundException('User does not exist!');
    }

    const connection = await this.userConnectionsRepository.findOne({ requestedBy: toUser, requestedFor: fromUser });

    if (!connection) {
      throw new BadRequestException('Friend request does not exist!');
    }

    if (connection.status === ConnectionStatus.Approved) {
      return { message: 'You are already friends!' };
    }

    connection.status = ConnectionStatus.Approved;
    await this.userConnectionsRepository.save(connection);

    return { message: `You are now friends with ${toUser.username}!` };
  }

  public async deleteFriendRequest(user: Partial<User>, id) {
    const fromUser = await this.userRepository.findOne({ id: user.id, isDeleted: false });
    const toUser = await this.userRepository.findOne({ id, isDeleted: false });

    if (!fromUser || !toUser) {
      throw new NotFoundException('User does not exist!');
    }

    const connection1 = await this.userConnectionsRepository.findOne({ requestedBy: fromUser, requestedFor: toUser });
    const connection2 = await this.userConnectionsRepository.findOne({ requestedBy: toUser, requestedFor: fromUser });

    if (!connection1 && !connection2) {
      throw new NotFoundException('Friendship does not exist!');
    }

    if (connection1) {
      await this.userConnectionsRepository.remove(connection1);
    }

    if (connection2) {
      await this.userConnectionsRepository.remove(connection2);
    }

    return { message: 'Friendship has been deleted!' };
  }
}
