import { useContext } from "react";
import { motion } from 'framer-motion';
import { AuthContext } from "../../context/AuthContext";
import CreatePost from "./CreatePost";
import SinglePost from "./SinglePost";
import { useGetPostsQuery } from "../../api/apiSlice";

const Posts = () => {
    const { user } = useContext(AuthContext);
    const { data } = useGetPostsQuery(user.id);

    return (
        <>
            <h2>Лични публикации</h2>
            {!user.latitude && <CreatePost />}
            {
                data?.length > 0 && data.map(post => <motion.div key={post.id} drag> <SinglePost  {...post} /> </motion.div>)
            }
        </>
    )
}

export default Posts;