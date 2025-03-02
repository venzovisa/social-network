import { ReactionType } from './../common/enums/reaction-type.enum';
import { ConnectionStatus } from './../common/enums/connection-status.enum';
import { ForbiddenException, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from 'src/data/entities/comment.entity';
import { UserCommentLikes } from 'src/data/entities/user-comment-likes.entity';
import { UserConnection } from 'src/data/entities/user-connection.entity';
import { UserPost } from 'src/data/entities/user-post.entity';
import { User } from 'src/data/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRole } from 'src/common/enums/user-role.enum';
import { toReturnCommentsWithLikesDTO } from 'src/utils/transformer';
import { CreateCommentDTO } from 'src/models/comment/create-comment-dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserPost) private readonly postRepository: Repository<UserPost>,
    @InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,
    @InjectRepository(UserCommentLikes) private readonly commentLikesRepository: Repository<UserCommentLikes>,
    @InjectRepository(UserConnection) private readonly friendsRepository: Repository<UserConnection>,
  ) { }
  
  public async getUserComments(loggedUser: Partial<User>, id: number) {
    const connection1 = await this.friendsRepository.findOne({ requestedBy: { id }, requestedFor: { id: loggedUser.id }, status: ConnectionStatus.Approved });
    const connection2 = await this.friendsRepository.findOne({ requestedBy: { id: loggedUser.id }, requestedFor: { id }, status: ConnectionStatus.Approved });
    
    if (!(loggedUser.role === UserRole.Admin || connection1 || connection2 || id === loggedUser.id)) {
      throw new ForbiddenException('You cannot access comments of this user!');
    }

    const comments = await this.commentRepository.find({
      where: {
        author: {
          id,
        },
        isDeleted: false,
      },
      relations: ['author', 'likes', 'likes.user']
    });

    return comments.map(toReturnCommentsWithLikesDTO);
  }

  public async createComment(loggedUser: Partial<User>, postId: number, comment: CreateCommentDTO, picture?: string) {
    if (comment.embed && picture) {
      throw new BadRequestException('Post cannot contain both embedded content and picture!');
    }

    const post = await this.postRepository.findOne({
      where: {
        id: postId,
        isDeleted: false,
      },
      relations: ['author'],
    });

    if (!post) {
      throw new NotFoundException('Post does not exist!');
    }

    if (!post.isPublic) {
      const connection1 = await this.friendsRepository.findOne({ requestedBy: { id: post.author.id }, requestedFor: { id: loggedUser.id }, status: ConnectionStatus.Approved });
      const connection2 = await this.friendsRepository.findOne({ requestedBy: { id: loggedUser.id }, requestedFor: { id: post.author.id }, status: ConnectionStatus.Approved });

      if (!(connection1 || connection2 || post.author.id === loggedUser.id)) {
        throw new ForbiddenException('You cannot comment on post!');
      }
    }

    if (picture) {
      (comment as any).picture = picture;
    }

    const commentToCreate = this.commentRepository.create({
      ...comment,
      author: {
        id: loggedUser.id,
      },
      post: {
        id: postId,
      },
    });

    const createdComment = await this.commentRepository.save(commentToCreate);

    const commentToTransform = await this.commentRepository.findOne({
      where: { id: createdComment.id },
      relations: ['author', 'likes', 'likes.user'],
    })

    return toReturnCommentsWithLikesDTO(commentToTransform);
  }

  public async updateComment(loggedUser: Partial<User>, id: number, comment: CreateCommentDTO, picture?: string) {
    if (comment.embed && picture) {
      throw new BadRequestException('Post cannot contain both embedded content and picture!');
    }
    
    const commentToUpdate = await this.commentRepository.findOne({
      where: {
        id,
        author: {
          id: loggedUser.id,
        },
        isDeleted: false,
      },
      relations: ['author', 'likes', 'likes.user', 'likes.comment'],
    });

    if (!commentToUpdate) {
      throw new NotFoundException('Comment does not exist!');
    }

    if (picture) {
      commentToUpdate.embed = null;
      commentToUpdate.picture = picture;
    } else if (comment.embed) {
      commentToUpdate.picture = null;
      commentToUpdate.embed = comment.embed;
    }

    commentToUpdate.content = comment.content || commentToUpdate.content;

    await this.commentRepository.save(commentToUpdate);

    return toReturnCommentsWithLikesDTO(commentToUpdate);
  }

  public async deleteComment(loggedUser: Partial<User>, id: number) {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: ['author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment does not exist!');
    }

    if (loggedUser.id !== comment.author.id && loggedUser.role !== UserRole.Admin) {
      throw new ForbiddenException('You cannot delete this comment!');
    }

    comment.isDeleted = true;

    await this.commentRepository.save(comment);
  }

  public async reactToComment(loggedUser: Partial<User>, id: number, reaction: ReactionType) {
    const comment = await this.commentRepository.findOne({
      where: {
        id,
        isDeleted: false,
      },
      relations: ['author', 'post', 'post.author'],
    });

    if (!comment) {
      throw new NotFoundException('Comment does not exist!');
    }
    
    if (!comment.post.isPublic) {
      const connection1 = await this.friendsRepository.findOne({ requestedBy: { id: comment.post.author.id }, requestedFor: { id: loggedUser.id }, status: ConnectionStatus.Approved });
      const connection2 = await this.friendsRepository.findOne({ requestedBy: { id: loggedUser.id }, requestedFor: { id: comment.post.author.id }, status: ConnectionStatus.Approved });

      if (!(loggedUser.id === comment.post.id || connection1 || connection2)) {
        throw new ForbiddenException('You cannot react tot his comment!');
      }
    }

    const like = await this.commentLikesRepository.findOne({
      where: {
        user: {
          id: loggedUser.id,
        },
        comment: {
          id: comment.id,
        },
      },
      relations: ['user', 'comment'],
    });

    if (!like) {
      const user = await this.userRepository.findOne(loggedUser.id);

      const likeToCreate = this.commentLikesRepository.create({
        user,
        comment,
        reaction,
      });

      return this.commentLikesRepository.save(likeToCreate);
    }

    if (like.reaction === reaction) {
      return this.commentLikesRepository.delete(like);
    }

    like.reaction = reaction;

    await this.commentLikesRepository.save(like);
  }

}
