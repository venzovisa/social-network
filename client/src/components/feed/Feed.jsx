import { useContext } from "react";
import { motion } from 'framer-motion';
import { AuthContext } from "../../context/AuthContext.ts";
import CreatePost from "../posts/CreatePost";
import SinglePost from "../posts/SinglePost";
import { useGetFeedQuery } from "../../api/apiSlice";

const Feed = () => {
    const { user } = useContext(AuthContext);
    const { data } = useGetFeedQuery(null);

    return (
        <>
            <motion.h2
                initial={{ opacity: 0, x: '-100vw', rotateY: -900 }}
                animate={{ opacity: 1, x: 0, rotateY: 0 }}
                transition={{ duration: 1, type: 'spring', stiffness: 15 }}>Дебати</motion.h2>
            {!user?.latitude && <CreatePost />}
            {
                data && data.map((post, index) => <motion.div drag
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