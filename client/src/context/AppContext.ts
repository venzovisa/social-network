import { createContext } from "react";
import { Post, User } from "../types/types";

type Context = {
  searchQuery: string;
  setSearchQuery: (data: string) => void;
  users: User[];
  setUsers: () => void;
  posts: [];
  setPosts: (posts: Post[]) => void;
  friends1: [];
  setFriends1: () => void;
};

export const AppContext = createContext<Context>({
  searchQuery: "",
  setSearchQuery: () => {},
  users: [],
  setUsers: () => {},
  posts: [],
  setPosts: () => {},
  friends1: [],
  setFriends1: () => {},
});
