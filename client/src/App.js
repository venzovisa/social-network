import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import Main from "./views/main/Main";
import Users from "./components/users/Users";
import Feed from "./components/feed/Feed";
import FeedPopular from "./components/feed-popular/FeedPopular";
import { Box } from "@mui/material";
import SidebarPublic from "./views/sidebar/SidebarPublic";
import SidebarPrivate from "./views/sidebar/SidebarPrivate";
import { NotFound } from "./views/not-found/NotFound";
import { AuthContext } from "./context/AuthContext.ts";
import { useEffect, useState } from "react";
import { getToken } from "./common/getToken.ts";
import Posts from "./components/posts/Posts";
import UserComments from "./components/comments/UserComments.tsx";
import NavbarPublic from "./components/navbar/NavbarPublic.tsx";
import NavbarPrivate from "./components/navbar/NavbarPrivate";
import { getUser } from "./services/requests";
import SearchUsers from "./components/users/SearchUsers";
import { AppContext } from "./context/AppContext.ts";
import FriendsRequest from "./components/users/FriendsRequests";
import Friends from "./components/users/Friends";
import UserProfile from "./components/users/UserProfile";
import HomeView from "./components/home/HomeView";
import People from "./components/users/People";
import { POLITICAL_ORIENTATION } from "./common/constants.ts";

function App() {
  const [loggedStatus, setLoggedStatus] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState({});
  const [friends1, setFriends1] = useState({});
  useEffect(() => {
    (async () => {
      const legalUser = await getUser();
      if (getToken() && legalUser) {
        setUser(legalUser);
        setLoggedStatus(true);
      } else {
        setLoggedStatus(false);
      }
    })();
  }, [loggedStatus, setLoggedStatus, setUser]);

  return (
    <div className={`wrapper ${POLITICAL_ORIENTATION[user.longitude]}`}>
      <AuthContext.Provider
        value={{
          loginStatus: loggedStatus,
          setLoginStatus: setLoggedStatus,
          user,
          setUser,
        }}
      >
        <AppContext.Provider
          value={{
            searchQuery: query,
            setSearchQuery: setQuery,
            posts,
            setPosts,
            friends1,
            setFriends1,
          }}
        >
          <Provider store={store}>
            <Router>
              {loggedStatus ? <NavbarPrivate /> : <NavbarPublic />}

              <Box
                sx={{
                  display: { xs: "flex" },
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
              >
                <Box
                  sx={{
                    flex: { md: "1.5 0 0", lg: "2 0 0", xl: "1 0 0" },
                    display: { xs: "none", md: "block" },
                  }}
                >
                  {loggedStatus ? <SidebarPrivate /> : <SidebarPublic />}
                </Box>
                <Switch>
                  <Route exact path="/">
                    <Main
                      render={() => (
                        <>
                          <HomeView />
                          <FeedPopular />
                        </>
                      )}
                    />
                  </Route>

                  <Route exact path="/posts">
                    {loggedStatus ? (
                      <Main render={() => <Posts />} />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>

                  <Route exact path="/users">
                    <Main
                      render={() => <Users />}
                      style={{ flex: { md: "3 0 0", lg: "4 0 0" } }}
                    />
                  </Route>
                  <Route exact path="/users/people">
                    <Main
                      render={() => <People />}
                      style={{ flex: { md: "3 0 0", lg: "4 0 0" } }}
                    />
                  </Route>

                  <Route exact path="/users/search">
                    <Main
                      render={() => <SearchUsers />}
                      style={{ flex: { md: "3 0 0", lg: "4 0 0" } }}
                    />
                  </Route>

                  <Route exact path="/users/requests">
                    {loggedStatus ? (
                      <Main
                        render={() => <FriendsRequest />}
                        style={{ flex: { md: "3 0 0" } }}
                      />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>

                  <Route exact path="/users/friends">
                    {loggedStatus ? (
                      <Main
                        render={() => <Friends />}
                        style={{ flex: { md: "3 0 0" } }}
                      />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>

                  <Route exact path="/users/comments">
                    {loggedStatus ? (
                      <Main render={() => <UserComments />} />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>

                  <Route path="/users/profile/:id">
                    {loggedStatus ? (
                      <Main render={() => <UserProfile />} />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>

                  <Route exact path="/feed">
                    {loggedStatus ? (
                      <Main render={() => <Feed />} />
                    ) : (
                      <Redirect to="/" />
                    )}
                  </Route>

                  <Route path="*">
                    <Main render={() => <NotFound />} />
                  </Route>
                </Switch>

                <Box sx={{ flex: { lg: "1 0 0" } }}></Box>
              </Box>
            </Router>
          </Provider>
        </AppContext.Provider>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
