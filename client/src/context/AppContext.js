import { createContext } from "react";
export const AppContext = createContext({
  searchQuery: "",
  setSearchQuery: () => {},
  users: [],
  setUsers: () => {},
  posts: [],
  setPosts: () => {},
  friends1: [],
  setFriends1: () => {},
});
