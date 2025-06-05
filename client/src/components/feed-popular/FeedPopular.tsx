import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CreatePost from "../posts/CreatePost";
import SingleFeedPopular from "./SingleFeedPopular";
import { useGetFeedPopularQuery } from "../../api/apiSlice";
import { Post } from "../../types/types";

const sortByDateDesc = (b: Post, a: Post) => {
    const nameA = new Date(a.createdOn).toISOString().toUpperCase();
    const nameB = new Date(b.createdOn).toISOString().toUpperCase();
    if (nameA < nameB) {
        return -1;
    }
    if (nameA > nameB) {
        return 1;
    }
    return 0;
}

const FeedPopular = () => {
    const { loginStatus } = useContext(AuthContext);
    const { data } = useGetFeedPopularQuery(null);

    return (
        <>
            <h2>Популярни</h2>
            {loginStatus && <CreatePost />}
            {
                data && data.length > 0 && data.toSorted(sortByDateDesc).map(post => <SingleFeedPopular key={post.id} {...post} />)
            }
        </>
    )
}

export default FeedPopular;