import { useContext, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import scrollToTop from "../../common/scrollToTop";
import { AuthContext } from "../../context/AuthContext";
import { deleteFriend, getUsers } from "../../services/requests";
import SingleUser from "./SingleUser";
import { User } from '../../types/types';

const FriendsRequest = () => {
    const [users, setUsers] = useState<User[]>([]);
    const { user } = useContext(AuthContext);
    scrollToTop();
    useEffect(() => {
        (async () => {
            setUsers((await getUsers()).filter((u: User) => u.friends.find(fr => fr.id === user.id && fr.friendshipStatus === 1 && !fr.canAcceptFriendship)));
        })()
    }, [setUsers, user.id])



    const handleRemove = async (id: number) => {
        await deleteFriend(id)
        setUsers(await getUsers())
    }

    // const handleAddFriend = async (id: number) => {
    //     await addFriend(id)
    //     setUsers(await getUsers())
    //     setUser(await getUser())
    // }


    // const handleAcceptFriend = async (id: number) => {
    //     await acceptFriend(id)
    //     setUsers(await getUsers())
    //     setUser(await getUser())
    // }

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
                                    handleDeleteUser={handleRemove}
                                    {...user}
                                />
                            </Grid>)
                }
            </Grid>

        </>
    )
}

export default FriendsRequest;