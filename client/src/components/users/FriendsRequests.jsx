import { Grid } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import scrollToTop from "../../common/scrollToTop";
import { AuthContext } from "../../context/AuthContext";
import { acceptFriend, addFriend, deleteFriend, getUser, getUsers } from "../../services/requests";
import SingleUser from "./SingleUser";

const FriendsRequest = () => {
    const [users, setUsers] = useState([]);
    const { user, setUser } = useContext(AuthContext)
    scrollToTop();
    useEffect(() => {
        (async () => {
            setUsers((await getUsers()).filter((u) => u.friends.find(fr => fr.id === user.id && fr.friendshipStatus === 1 && !fr.canAcceptFriendship)));
        })()
    }, [setUsers, user.id])



    const handleRemove = async (id) => {
        await deleteFriend(id)
        setUsers(await getUsers())
    }

    const handleAddFriend = async (id) => {
        await addFriend(id)
        setUsers(await getUsers())
        setUser(await getUser())
    }


    const handleAcceptFriend = async (id) => {
        await acceptFriend(id)
        setUsers(await getUsers())
        setUser(await getUser())
    }

    if (users.length === 0) {
        return <h2>Нямате заявки за одобрение!</h2>
    }

    return (
        <>
            <h2>Чакащи одобрение</h2>

            <Grid container spacing={2} alignItems="center">
                {
                    users && users
                        .filter(u => u.id !== user.id)
                        .map(user =>
                            <Grid key={user.id} item xs={12} sm={6} lg={4} xl={3} >
                                <SingleUser
                                    handleRemove={handleRemove}
                                    handleAddFriend={handleAddFriend}
                                    handleAcceptFriend={handleAcceptFriend}
                                    {...user}
                                />
                            </Grid>)
                }
            </Grid>

        </>
    )
}

export default FriendsRequest;