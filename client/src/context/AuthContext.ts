import { JwtPayload } from "jsonwebtoken";
import { createContext } from "react";
import { User } from "../types/types";

export const AuthContext = createContext<{
  loginStatus: boolean;
  setLoginStatus: (value: boolean) => void;
  user: User;
  setUser: (token: string | JwtPayload | null) => void;
}>({
  loginStatus: false,
  setLoginStatus: () => {},
  user: {
    id: 0,
    username: "",
    avatar: "",
    role: 0,
    banDate: "",
    banReason: "",
    email: "",
    lastUpdated: "",
    latitude: 0,
    longitude: 0,
    friends: [],
  },
  setUser: () => {},
});
