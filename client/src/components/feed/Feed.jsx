import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.ts";
import { getFeed } from "../../services/requests";
import CreatePost from "../posts/CreatePost";
import SinglePost from "../posts/SinglePost";
import { motion } from 'framer-motion';

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        (async () => {
            setPosts(await getFeed());
        })()
    }, [setPosts])

    return (
        <>
            <motion.h2
                initial={{ opacity: 0, x: '-100vw', rotateY: -900 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1, type: 'spring', stiffness: 15 }}>Дебати</motion.h2>
            {!user?.latitude && <CreatePost />}
            {
                posts && posts.map((post, index) => <motion.div drag
                    initial={{ y: 1000 }}
                    animate={{ y: 0 }}
                    transition={{ type: 'tween', duration: 1, delay: index }}
                    key={post.id}><SinglePost  {...post} /></motion.div>)
            }
            {/* {
                user?.friends.length === 0 && <p className="text">Все още нямате абонаменти</p>
            }     */}
        </>
    )
}

export default Feed;