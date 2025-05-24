import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import scrollToTop from "../../common/scrollToTop";
import { AppContext } from "../../context/AppContext";
import { AuthContext } from "../../context/AuthContext";
import { deleteFriend, getUsers } from "../../services/requests";
import SingleUser from "./SingleUser";
import { User } from "../../types/types";

const SearchUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { user } = useContext(AuthContext);
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


    const handleRemoveFriend = async (id: number) => {
        await deleteFriend(id)
        setUsers(await getUsers())
    }

    // const handleAddFriend = async (id: number) => {
    //     await addFriend(id);
    //     setUsers(await getUsers());
    //     setUser(await getUser());
    // }


    // const handleAcceptFriend = async (id: number) => {
    //     await acceptFriend(id);
    //     setUsers(await getUsers());
    //     setUser(await getUser());
    // }

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
                                    handleDeleteUser={handleRemoveFriend}
                                    {...user} />
                            </Grid>)
                    ) || <h2>Няма намерени съвпадения</h2>
                }
            </Grid>

        </>
    )
}

export default SearchUsers;