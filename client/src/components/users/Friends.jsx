import { Grid, Grow } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { API } from "../../common/constants";
import { AuthContext } from "../../context/AuthContext";
import { acceptFriend, addFriend, deleteFriend, getUser, getUsers } from "../../services/requests";
import SingleUser from "./SingleUser";
import { motion } from 'framer-motion';

const Friends = () => {
    const [users, setUsers] = useState([]);
    const { user, setUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            setUsers((await getUsers()).filter((u) => u.friends.find(fr => fr.id === user.id && fr.friendshipStatus === 2)));
        })()
    }, [setUsers, user.id])

    const handleRemove = async (id) => {
        await deleteFriend(id)
        setUsers((await getUsers()).filter((u) => u.friends.find(fr => fr.id === user.id && fr.friendshipStatus === 2)))
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

    if (users?.length === 0) {
        return <div style={{ textAlign: 'center' }}>
            <h2>Нямате нито един приятел! :(</h2>
            <img src={`${API}/nofriends.png`} alt='Sad face' />
        </div>
    }

    const header = users.length === 1 ? <h2>Имате само един приятел :( </h2> : <motion.h2 initial={{ opacity: 0, x: '-100vw' }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, type: 'spring', stiffness: 120 }}>Имате {users.length} приятели:</motion.h2>

    return (
        <>
            {header}

            <Grid container spacing={2} alignItems="center">
                {
                    users && users
                        .filter(u => u.id !== user.id)
                        .map((user, index) =>
                            <Grow in timeout={index * 100} key={user.id}>
                                <Grid key={user.id} item xs={12} sm={6} lg={4} xl={3} >
                                    <SingleUser
                                        handleRemove={handleRemove}
                                        handleAddFriend={handleAddFriend}
                                        handleAcceptFriend={handleAcceptFriend}
                                        {...user}
                                    />
                                </Grid>
                            </Grow>
                        )
                }
            </Grid>
        </>
    )
}

export default Friends;