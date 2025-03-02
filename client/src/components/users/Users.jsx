import { Button, Grid } from "@mui/material";
import Grow from '@mui/material/Grow';
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { deleteUser, getUser, getUsers } from "../../services/requests";
import SingleUser from "./SingleUser";
import { motion } from 'framer-motion';
import scrollToTop from "../../common/scrollToTop";

const API = 'https://localhost:5000';

const Users = () => {
    const [users, setUsers] = useState([]);
    const { user, setUser } = useContext(AuthContext);
    const [surprise, setSurprise] = useState(false)

    useEffect(() => {
        (async () => {
            setUsers((await getUsers())
                .filter(u => !u.latitude)
            );
        })()
    }, [setUsers])

    const handleDeleteUser = async (id) => {
        scrollToTop();
        await deleteUser(id);
        setUsers(await getUsers());
        setUser(await getUser())
    }

    const surpriseBox = surprise ? <div style={{ marginTop: '1rem', backgroundSize: 'cover', background: 'Url(https://cdn3.vectorstock.com/i/1000x1000/01/82/light-striped-background-vector-7210182.jpg)' }}>
        <motion.img drag style={{ height: '20px', padding: '1rem' }}
            src={`${API}/1.png`} alt="mustak" />
        <motion.img drag style={{ height: '20px', padding: '1rem' }}
            src={`${API}/2.png`} alt="ochila" />
        <motion.img drag style={{ height: '30px', padding: '1rem' }}
            src={`${API}/2.png`} alt="ochila2" />
        <motion.img drag style={{ height: '40px', padding: '1rem' }}
            src={`${API}/3.png`} alt="cigara" />
        <motion.img drag style={{ height: '250px', padding: '1rem' }}
            src={`${API}/4.png`} alt="klounska shapka" />
        <motion.img drag style={{ height: '15px', padding: '1rem' }}
            src={`${API}/5.png`} alt="Website main logo" />
        <motion.img drag style={{ height: '100px', padding: '1rem' }}
            src={`${API}/6.png`} alt="Website main logo" />
        <motion.img drag style={{ height: '80px', padding: '1rem' }}
            src={`${API}/7.png`} alt="Website main logo" />
        <motion.img drag style={{ height: '80px', padding: '1rem' }}
            src={`${API}/8.png`} alt="Website main logo" />
        <motion.img drag style={{ height: '80px', padding: '1rem' }}
            src={`${API}/9.png`} alt="Website main logo" />
        <motion.img drag style={{ height: '80px', padding: '1rem' }}
            src={`${API}/10.png`} alt="sunglasses2" />
        <motion.img drag style={{ height: '80px', padding: '1rem' }}
            src={`${API}/11.png`} alt="krushka" />
        <motion.img drag style={{ height: '160px', padding: '1rem' }}
            src={`${API}/12.png`} alt="dialog" />
        <motion.img drag style={{ height: '250px', padding: '1rem' }}
            src={`${API}/13.png`} alt="clown hair" />
        <motion.img drag style={{ height: '180px', padding: '1rem' }}
            src={`${API}/14.png`} alt="viking helmet" />
        <motion.img drag style={{ height: '80px', padding: '1rem' }}
            src={`${API}/15.png`} alt="nazi helmet" />
        <motion.img drag style={{ height: '140px', padding: '1rem' }}
            src={`${API}/16.png`} alt="gun" />
        <motion.img drag style={{ height: '125px', padding: '1rem' }}
            src={`${API}/17.png`} alt="pirat" />
        <motion.img drag style={{ height: '40px', padding: '1rem' }}
            src={`${API}/18.png`} alt="weed" />
        <motion.img drag style={{ height: '40px', padding: '1rem' }}
            src={`${API}/19.png`} alt="clown nose" />
        <motion.img drag style={{ height: '100px', padding: '1rem' }}
            src={`${API}/20.png`} alt="christmas" />
        <motion.img drag style={{ height: '50px', padding: '1rem' }}
            src={`${API}/21.png`} alt="rabbit" />
        <motion.img drag style={{ height: '130px', padding: '1rem' }}
            src={`${API}/22.png`} alt="turk" />
    </div> : ''


    return (
        <>
            <motion.h2 initial={{ opacity: 0, y: -200 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 1000 }}>
                Имаме {users.length} политици в нашата социална мрежа Political battle!
            </motion.h2>



            <Grid container spacing={2} alignItems="center">
                {
                    users && users
                        .filter(u => u.id !== user.id)
                        .map((user, index) =>
                            <Grow in timeout={index * 100} key={user.id}>
                                <Grid item xs={12} sm={6} lg={4} xl={3} >
                                    <motion.div
                                        drag
                                        initial={{ x: 2000 * (Math.random() - 0.5), rotateX: -180, rotateZ: -180, rotateY: -180, y: 800 }}
                                        animate={{ y: 0, x: 0, rotateX: 0, rotateY: 0, rotateZ: 0 }}
                                        transition={{ type: 'spring', stiffness: 20, delay: Math.random() * 3 }}
                                    >
                                        <SingleUser
                                            handleDeleteUser={handleDeleteUser}
                                            {...user}
                                        />
                                    </motion.div>
                                </Grid>
                            </Grow>
                        )
                }
            </Grid>

            <motion.div drag style={{ zIndex: '2' }}
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.2, originX: 0 }}
                transition={{ type: 'spring', stiffness: '800' }}>
                <Button variant="contained" sx={{ marginTop: '2rem' }} onClick={() => { setSurprise(!surprise) }}>
                    Surprise Box
                </Button>
            </motion.div>
            {surpriseBox}

        </>
    )
}

export default Users;