import { Grid } from "@mui/material";
import Grow from '@mui/material/Grow';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { acceptFriend, addFriend, deleteFriend, deleteUser, getUser, getUsers } from "../../services/requests";
import SingleUser from "./SingleUser";
import { motion } from 'framer-motion';
import scrollToTop from "../../common/scrollToTop";

const People = () => {
    const [users, setUsers] = useState([]);
    const { user, setUser } = useContext(AuthContext)

    useEffect(() => {
        (async () => {
            setUsers((await getUsers())
                .filter(u => u.latitude === 1)
            );
        })()
    }, [setUsers])



    const handleRemove = async (id) => {
        scrollToTop()
        await deleteFriend(id)
        setUsers(await getUsers())
    }

    const handleAddFriend = async (id) => {
        scrollToTop()
        await addFriend(id)
        setUsers(await getUsers())
        setUser(await getUser())
    }


    const handleAcceptFriend = async (id) => {
        scrollToTop()
        await acceptFriend(id)
        setUsers(await getUsers())
        setUser(await getUser())
    }


    const handleDeleteUser = async (id) => {
        scrollToTop()
        await deleteUser(id);
        setUsers(await getUsers());
        setUser(await getUser());
    }

    return (
        <>
            <motion.h2
                initial={{ y: -500 }}
                animate={{ y: 0 }}
                transition={{ type: 'tween', duration: 1 }}
            >Имаме {users.length} потребители в нашата социална мрежа Political battle!</motion.h2>

            <Grid container spacing={2} alignItems="center">
                {
                    users && users
                        .filter(u => u.id !== user.id)
                        .map((user, index) =>
                            <Grow in timeout={index * 100} key={user.id}>
                                <Grid item xs={12} sm={6} lg={4} xl={3} >
                                    <motion.div
                                        drag
                                        initial={{ x: 2000 * (Math.random() - 0.5), rotateX: -720, rotateZ: -180, rotateY: -180, y: 800 }}
                                        animate={{ y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0 }}
                                        transition={{ type: 'spring', stiffness: 20, delay: Math.random() * 2 }}
                                    >
                                        <SingleUser
                                            handleRemove={handleRemove}
                                            handleAddFriend={handleAddFriend}
                                            handleAcceptFriend={handleAcceptFriend}
                                            handleDeleteUser={handleDeleteUser}
                                            {...user}
                                        />
                                    </motion.div>
                                </Grid>
                            </Grow>
                        )
                }
            </Grid>

        </>
    )
}

export default People;