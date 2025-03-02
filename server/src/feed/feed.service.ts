import { toReturnSimplePostDTO, toReturnPostWithCommentsDTO, toReturnCommentsDeltaDTO } from './../utils/transformer';
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/data/entities/comment.entity';
import { UserConnection } from 'src/data/entities/user-connection.entity';
import { UserPost } from 'src/data/entities/user-post.entity';
import { User } from 'src/data/entities/user.entity';
import { Between, FindConditions, In, MoreThan, Repository } from 'typeorm';
import { ReturnDeltaFeedDTO } from 'src/models/post/return-delta-feed-dto';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserPost) private readonly postRepository: Repository<UserPost>,
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(UserConnection) private readonly friendsRepository: Repository<UserConnection>,
  ) {}
  
  public async getFeed(loggedUser: Partial<User>, page: number, count: number, distance: number) {
    const user = await this.userRepository.findOne(loggedUser.id);

    if (Number.isNaN(page)) {
      page = 0;
    }

    if (Number.isNaN(count)) {
      count = 20;
    }

    const postsForIds = await this.getFeedUserIds(loggedUser.id);

    const findConditions: FindConditions<UserPost> = {
      author: {
        id: In(postsForIds),
      },
      isDeleted: false,
    };

    if (!Number.isNaN(distance)) {
      if (user.latitude === null || user.longitude === null) {
        throw new BadRequestException('Please update user location in order to perform that operation!');
      }

      findConditions.latitude = Between(user.latitude - distance, user.latitude + distance);
      findConditions.longitude = Between(user.longitude - distance, user.longitude + distance);
    }

    const posts = await this.postRepository.find({
      where: findConditions,
      order: {
        updatedOn: 'DESC',
      },
      take: count,
      skip: page * count,
      relations: ['author', 'likes', 'likes.user', 'comments', 'comments.author', 'comments.likes', 'comments.likes.user'],
    });

    return posts.map(toReturnPostWithCommentsDTO);
  }

  public async getMostPopular() {
    const posts = await this.postRepository
      .createQueryBuilder('posts')
      .loadRelationCountAndMap('posts.likesCount', 'posts.likes', 'l')
      .getMany();

    const postsToReturn = posts
      .filter(p => p.isPublic)
      .filter(p => !p.isDeleted)
      .sort((p1: any, p2: any) => p2.likesCount - p1.likesCount)
      .slice(0, 20);
    
    return postsToReturn.map(toReturnSimplePostDTO);
  }

  public async getDelta(loggedUser: Partial<User>, createdOrUpdatedAfter: Date, trackingPosts: number[] = []): Promise<ReturnDeltaFeedDTO> {
    const postsForIds = await this.getFeedUserIds(loggedUser.id);

    let posts = await this.postRepository.find({
      where: {
        author: {
          id: In(postsForIds),
        },
        isDeleted: false,
        // updatedOn: MoreThan(createdOrUpdatedAfter),
      },
      relations: ['author', 'likes', 'likes.user', 'comments', 'comments.author', 'comments.likes', 'comments.likes.user'],
    });

    posts = posts.filter(p => new Date(p.updatedOn).valueOf() > createdOrUpdatedAfter.valueOf());

    posts.forEach(p => p.comments = p.comments.filter(c => c.updatedOn.valueOf() > createdOrUpdatedAfter.valueOf()));

    const comments = await this.commentRepository.find({
      where: {
        author: {
          id: In(postsForIds),
        },
        post: {
          id: In(trackingPosts),
        },
        isDeleted: false,
        // updatedOn: MoreThan(createdOrUpdatedAfter),
      },
      relations: ['author', 'likes', 'likes.user', 'post'],
    });

    return {
      posts: posts.map(toReturnPostWithCommentsDTO),
      comments: comments.filter(c => new Date(c.updatedOn).valueOf() > createdOrUpdatedAfter.valueOf()).map(toReturnCommentsDeltaDTO),
    };
  }

  private async getFeedUserIds(id: number) {
    const connections1 = await this.friendsRepository.find({
      where: {
        requestedBy: {
          id,
        },
      },
      relations: ['requestedFor']
    });
    const connections2 = await this.friendsRepository.find({
      where: {
        requestedFor: {
          id,
        },
      },
      relations: ['requestedBy'],
    });

    return [id, ...connections1.map(c => c.requestedFor.id), ...connections2.map(c => c.requestedBy.id)];
  }
}
