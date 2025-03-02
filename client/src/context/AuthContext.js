import { createContext } from "react";
export const AuthContext = createContext({
  loginStatus: false,
  setLoginStatus: () => {},
  user: {},
  setUser: () => {},
});
