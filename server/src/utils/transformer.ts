import { SimpleUserDTO } from './../models/user/simple-user-dto';
import { ReturnCommentDeltaDTO } from './../models/comment/return-comment-delta-dto';
import { ReturnCommentWithLikesDTO } from './../models/comment/return-comment-with-likes-dto';
import { SimpleUserReactionDTO } from './../models/user/simple-user-reaction-dto';
import { UserPostLikes } from './../data/entities/user-post-likes.entity';
import { ReturnPostWithCommentsDTO } from './../models/post/return-post-with-comments-dto';
import { DeepPartial } from 'typeorm';
import { ReturnPostDTO } from './../models/post/return-post-dto';
import { UserPost } from './../data/entities/user-post.entity';
import { ReturnUserWithFriendsDTO } from './../models/user/return-user-with-friends-dto';
import { User } from 'src/data/entities/user.entity';
import { ReturnUserDTO } from './../models/user/return-user-dto';
import { Comment } from 'src/data/entities/comment.entity';
import { UserCommentLikes } from 'src/data/entities/user-comment-likes.entity';
import { ReturnSimplePostDTO } from 'src/models/post/return-simple-post-dto';
import { ConnectionStatus } from 'src/common/enums/connection-status.enum';
export const toSingleUser = <T extends Partial<User>>(user: T): ReturnUserDTO => {

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    latitude: user.latitude,
    longitude: user.longitude,
    banDate: user.banDate,
    banReason: user.banReason,
    lastUpdated: user.lastUpdated,
  };
};

export const toUserWithFriends = <T extends Partial<User>>(user: T): ReturnUserWithFriendsDTO => {
  const friends: SimpleUserDTO[] = [];

  user.requestedConnections.forEach(c => friends.push({
    id: c.requestedFor.id,
    avatar: c.requestedFor.avatar,
    username: c.requestedFor.username,
    friendshipStatus: c.status,
    canAcceptFriendship: false,
  }));

  user.requestsFromConnections.forEach(c => friends.push({
    id: c.requestedBy.id,
    avatar: c.requestedBy.avatar,
    username: c.requestedBy.username,
    friendshipStatus: c.status,
    canAcceptFriendship: c.status === ConnectionStatus.Sent,
  }));

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    latitude: user.latitude,
    longitude: user.longitude,
    banDate: user.banDate,
    banReason: user.banReason,
    lastUpdated: user.lastUpdated,
    friends,
  };
};

export const toReturnPostDTO = <T extends DeepPartial<UserPost>>(post: T): ReturnPostDTO => {

  return {
    id: post.id,
    content: post.content,
    picture: post.picture,
    embed: post.embed,
    latitude: post.latitude,
    longitude: post.longitude,
    createdOn: String(post.createdOn),
    updatedOn: String(post.updatedOn),
    isPublic: post.isPublic,
    author: {
      id: post.author.id,
      username: post.author.username,
      avatar: post.author.avatar,
    },
  };
};

export const toReturnPostWithCommentsDTO = <T extends DeepPartial<UserPost>>(post: T): ReturnPostWithCommentsDTO => {

  return {
    id: post.id,
    content: post.content,
    picture: post.picture,
    embed: post.embed,
    latitude: post.latitude,
    longitude: post.longitude,
    createdOn: String(post.createdOn),
    updatedOn: String(post.updatedOn),
    isPublic: post.isPublic,
    author: {
      id: post.author.id,
      username: post.author.username,
      avatar: post.author.avatar,
    },
    likes: post.likes.map(toSimpleUserReaction),
    comments: post.comments.map(toReturnCommentsWithLikesDTO),
  };
};

export const toSimpleUserReaction = <T extends DeepPartial<UserPostLikes | UserCommentLikes>>(like: T): SimpleUserReactionDTO => {

  return {
    id: like.user.id,
    username: like.user.username,
    avatar: like.user.avatar,
    reaction: like.reaction,
  }
};

export const toReturnCommentsWithLikesDTO = <T extends DeepPartial<Comment>>(comment: T): ReturnCommentWithLikesDTO => {

  return {
    id: comment.id,
    content: comment.content,
    picture: comment.picture,
    embed: comment.embed,
    createdOn: String(comment.createdOn),
    updatedOn: String(comment.updatedOn),
    author: {
      id: comment.author.id,
      username: comment.author.username,
      avatar: comment.author.avatar,
    },
    likes: comment.likes.map(toSimpleUserReaction),
  };
};


export const toReturnCommentsDeltaDTO = <T extends DeepPartial<Comment>>(comment: T): ReturnCommentDeltaDTO => {

  return {
    id: comment.id,
    content: comment.content,
    picture: comment.picture,
    embed: comment.embed,
    createdOn: String(comment.createdOn),
    updatedOn: String(comment.updatedOn),
    postId: comment.post.id,
    author: {
      id: comment.author.id,
      username: comment.author.username,
      avatar: comment.author.avatar,
    },
    likes: comment.likes.map(toSimpleUserReaction),
  };
};

export const toReturnSimplePostDTO = <T extends DeepPartial<UserPost>>(post: T): ReturnSimplePostDTO => {

  return {
    id: post.id,
    content: post.content,
    picture: post.picture,
    embed: post.embed,
    createdOn: String(post.createdOn),
    likesCount: (post as any).likesCount
  }
};
