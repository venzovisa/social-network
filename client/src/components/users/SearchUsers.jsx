import { Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import scrollToTop from "../../common/scrollToTop";
import { AppContext } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";
import { acceptFriend, addFriend, deleteFriend, getUser, getUsers } from "../../services/requests";
import SingleUser from "./SingleUser";

const SearchUsers = () => {
    const [users, setUsers] = useState([]);
    const { user, setUser } = useContext(AuthContext);
    const { searchQuery } = useContext(AppContext);
    scrollToTop();
    useEffect(() => {
        (async () => {
            const searchedByName = await getUsers(`name=${searchQuery}`);
            const searchedByEmail = await getUsers(`email=${searchQuery}`);

            if (searchedByName.length > 0) {
                return setUsers(searchedByName);
            }

            if (searchedByEmail.length > 0) {
                return setUsers(searchedByEmail);
            }
        })()
    }, [setUsers, searchQuery])


    const handleRemoveFriend = async (id) => {
        await deleteFriend(id)
        setUsers(await getUsers())
    }

    const handleAddFriend = async (id) => {
        await addFriend(id);
        setUsers(await getUsers());
        setUser(await getUser());
    }


    const handleAcceptFriend = async (id) => {
        await acceptFriend(id);
        setUsers(await getUsers());
        setUser(await getUser());
    }

    return (
        <>
            <h2>Резултати от търсенето за "{searchQuery}"</h2>

            <Grid container spacing={2} alignItems="center">
                {
                    (users && users
                        .filter(u => u.id !== user.id)
                        .map(user =>
                            <Grid key={user.id} item xs={3}>
                                <SingleUser
                                    key={user.id}
                                    handleRemoveFriend={handleRemoveFriend}
                                    handleAddFriend={handleAddFriend}
                                    handleAcceptFriend={handleAcceptFriend}
                                    {...user} />
                            </Grid>)
                    ) || <h2>Няма намерени съвпадения</h2>
                }
            </Grid>

        </>
    )
}

export default SearchUsers;