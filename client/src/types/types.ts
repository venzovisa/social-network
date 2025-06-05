export type Author = {
  id: number;
  avatar: string;
  username: string;
};

export type Like = {
  reaction: number;
} & Author;

export type Comment = {
  id: number;
  author: Author;
  content: string;
  createdOn: string;
  picture: string;
  likes: Like[];
  embed: string;
};

export type Post = {
  id: number;
  content: string;
  createdOn: string;
  updatedOn: string;
  picture: string;
  likesCount: number;
  embed: string;
  isPublic: boolean;
  author: Author;
  likes: Like[];
  comments: Comment[];
};

export type Friend = {
  id: number;
  username: string;
  avatar: string;
  canAcceptFriendship: boolean;
  friendshipStatus: number;
};

export type User = {
  id: number;
  role: number;
  username: string;
  avatar: string;
  banDate: string;
  banReason: string;
  email: string;
  lastUpdated: string;
  latitude: number;
  longitude: number;
  friends: Friend[];
};

export type UpdatePostForm = {
  content: string;
  isPublic: string;
  file: string | Blob;
  embed: string;
};
