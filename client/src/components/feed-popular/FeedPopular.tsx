import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getFeedPopular } from "../../services/requests";
import CreatePost from "../posts/CreatePost";
import SingleFeedPopular from "./SingleFeedPopular";
import { Post } from "../../types/types";

const FeedPopular = () => {
    const { loginStatus } = useContext(AuthContext);
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        (async () => {
            setPosts(await getFeedPopular());
        })();
    }, [])

    return (
        <>
            <h2>Популярни</h2>
            {loginStatus && <CreatePost />}
            {
                posts.length > 0 && posts.map(post => <SingleFeedPopular key={post.id} {...post} />)
            }
        </>
    )
}

export default FeedPopular;