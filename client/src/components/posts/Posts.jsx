import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getUserPosts } from "../../services/requests";
import CreatePost from "./CreatePost";
import SinglePost from "./SinglePost";
import { motion } from 'framer-motion';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const { user } = useContext(AuthContext);
    useEffect(() => {
        (async () => {
            setPosts(await getUserPosts(user.id));
        })()
    }, [user.id])

    return (
        <>
            <h2>Лични публикации</h2>
            {!user.latitude && <CreatePost />}
            {
                posts?.length > 0 && posts.map(post => <motion.div key={post.id} drag> <SinglePost  {...post} setPosts={setPosts} /> </motion.div>)
            }
        </>
    )
}

export default Posts;