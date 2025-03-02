import { ReactionType } from './../common/enums/reaction-type.enum';
import { toReturnPostDTO, toReturnPostWithCommentsDTO } from './../utils/transformer';
import { CreatePostDTO } from './../models/post/create-post-dto';
import { UserPost } from './../data/entities/user-post.entity';
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindConditions, Repository } from 'typeorm';
import { User } from 'src/data/entities/user.entity';
import { UserRole } from 'src/common/enums/user-role.enum';
import { UserConnection } from 'src/data/entities/user-connection.entity';
import { ConnectionStatus } from 'src/common/enums/connection-status.enum';
import { UserPostLikes } from 'src/data/entities/user-post-likes.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(UserPost) private readonly postRepository: Repository<UserPost>,
    @InjectRepository(UserConnection) private readonly friendsRepository: Repository<UserConnection>,
    @InjectRepository(UserPostLikes) private readonly postLikesRepository: Repository<UserPostLikes>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) { }

  public async getUsersPosts(loggedUser: Partial<User>, id: number, page: number, count: number) {
    const connection1 = await this.friendsRepository.findOne({ requestedBy: { id }, requestedFor: { id: loggedUser.id }, status: ConnectionStatus.Approved });
    const connection2 = await this.friendsRepository.findOne({ requestedBy: { id: loggedUser.id }, requestedFor: { id }, status: ConnectionStatus.Approved });

    if (Number.isNaN(page)) {
      page = 0;
    }

    if (Number.isNaN(count)) {
      count = 20;
    }

    const findConditions: FindConditions<UserPost> = {
      author: {
        id,
      },
      isDeleted: false,
    };

    if (!(connection1 || connection2 || loggedUser.id === id)) {
      findConditions.isPublic = true;
    }

    const posts = await this.postRepository.find({
      where: findConditions,
      relations: ['author', 'likes', 'likes.user', 'comments', 'comments.author', 'comments.likes', 'comments.likes.user'],
      take: count,
      skip: page * count,
    });

    return posts.map(toReturnPostWithCommentsDTO);
  }

  public async getPostById(loggedUser: Partial<User>, id: number) {
    const connection1 = await this.friendsRepository.findOne({ requestedBy: { id }, requestedFor: { id: loggedUser.id }, status: ConnectionStatus.Approved });
    const connection2 = await this.friendsRepository.findOne({ requestedBy: { id: loggedUser.id }, requestedFor: { id }, status: ConnectionStatus.Approved });

    const findConditions: FindConditions<UserPost> = {
      id,
      isDeleted: false,
    };

    if (!(connection1 || connection2)) {
      findConditions.isPublic = true;
    }

    const post = await this.postRepository.findOne({
      where: findConditions,
      relations: ['author', 'likes', 'likes.user', 'comments', 'comments.author', 'comments.likes', 'comments.likes.user'],
    });

    if (!post) {
      throw new NotFoundException('Post does not exist!');
    }

    return toReturnPostWithCommentsDTO(post);
  }

  public async createPost(loggedUser: Partial<User>, post: CreatePostDTO, picture?: string,) {
    if (!(post.content || post.embed || picture)) {
      throw new BadRequestException('Trying to publish an empty post?');
    }

    if (post.embed && picture) {
      throw new BadRequestException('Post cannot contain both embedded content and picture!');
    }

    const postToCreate = this.postRepository.create({
      ...post,
      author: {
        id: loggedUser.id,
      },
      picture: picture ?? null,
      latitude: post.latitude ? +post.latitude : null,
      longitude: post.longitude ? +post.longitude : null,
      isPublic: post.isPublic === 'true',
    });

    const postToReturn = await this.postRepository.save(postToCreate);

    return toReturnPostDTO({
      ...postToReturn,
      author: {
        id: loggedUser.id,
        username: loggedUser.username,
        avatar: loggedUser.avatar,
      }
    });
  }

  public async updatePost(loggedUser: Partial<User>, id: number, post: CreatePostDTO, picture?: string) {
    const findConditions: FindConditions<UserPost> = {
      id,
      isDeleted: false,
    };

    if (loggedUser.role !== UserRole.Admin) {
      findConditions.author = { id: loggedUser.id };
    }

    const postToUpdate = await this.postRepository.findOne({
      where: findConditions,
    });

    if (!postToUpdate) {
      throw new NotFoundException('Post does not exist!');
    }

    if (picture && post.embed) {
      throw new BadRequestException('Post cannot contain both embedded content and picture!');
    }

    if (picture) {
      postToUpdate.embed = null;
    }

    if (post.embed) {
      postToUpdate.picture = null;
    }

    await this.postRepository.save({
      ...postToUpdate,
      content: post.content ?? postToUpdate.content,
      embed: post.embed ?? postToUpdate.embed,
      picture: picture ?? postToUpdate.picture,
      latitude: post.latitude ? +post.latitude : postToUpdate.latitude,
      longitude: post.longitude ? +post.longitude : postToUpdate.longitude,
      isPublic: post.isPublic === 'true' || postToUpdate.isPublic,
    });

    const postToReturn = await this.postRepository.findOne({
      where: { id },
      relations: ['author'],
    });

    return toReturnPostDTO(postToReturn);
  }

  public async deletePost(loggedUser: Partial<User>, id: number) {
    const findConditions: FindConditions<UserPost> = {
      id,
      isDeleted: false,
    };

    if (loggedUser.role !== UserRole.Admin) {
      findConditions.author = { id: loggedUser.id };
    }

    const postToDelete = await this.postRepository.findOne({
      where: findConditions,
    });

    if (!postToDelete) {
      throw new NotFoundException('Post does not exist!');
    }

    postToDelete.isDeleted = true;
    await this.postRepository.save(postToDelete);
  }

  public async reactToPost(loggedUser: Partial<User>, id, reactionType: ReactionType) {
    const connection1 = await this.friendsRepository.findOne({ requestedBy: { id }, requestedFor: { id: loggedUser.id }, status: ConnectionStatus.Approved });
    const connection2 = await this.friendsRepository.findOne({ requestedBy: { id: loggedUser.id }, requestedFor: { id }, status: ConnectionStatus.Approved });

    const findConditions: FindConditions<UserPost> = {
      id,
      isDeleted: false,
    };

    if (!(connection1 || connection2)) {
      findConditions.isPublic = true;
    }

    const post = await this.postRepository.findOne({
      where: findConditions,
    });

    if (!post) {
      throw new NotFoundException('Post does not exist!');
    }

    const like = await this.postLikesRepository.findOne({
      where: {
        user: {
          id: loggedUser.id,
        },
        post: {
          id,
        }
      },
      relations: ['post', 'user'],
    });

    if (!like) {
      const user = await this.userRepository.findOne(loggedUser.id);
      const likeToCreate = this.postLikesRepository.create({
        user,
        post,
        reaction: reactionType,
      });

      return this.postLikesRepository.save(likeToCreate);
    }

    if (like.reaction === reactionType) {
      return this.postLikesRepository.delete(like);
    }

    like.reaction = reactionType;

    await this.postLikesRepository.save(like);
  }
}
