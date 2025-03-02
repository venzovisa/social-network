import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getFeedPopular } from "../../services/requests";
import CreatePost from "../posts/CreatePost";
import SingleFeedPopular from "./SingleFeedPopular";

const FeedPopular = () => {
    const { loggedStatus } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        (async () => {
            setPosts(await getFeedPopular());
        })();
    }, [])

    return (
        <>
            <h2>Популярни</h2>
            {loggedStatus && <CreatePost />}
            {
                posts.length > 0 && posts.map(post => <SingleFeedPopular key={post.id} {...post} />)
            }
        </>
    )
}

export default FeedPopular;