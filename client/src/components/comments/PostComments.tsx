import { Box } from "@mui/system";
import SinglePostComment from "./SinglePostComment";
import { Comment } from "../../types/types";
import { useGetPostCommentsQuery } from "../../api/apiSlice";

type PostCommentsProps = {
    comments: Comment[];
    handleDeleteComment: () => void;
    postId: number;
}

const PostComments = ({ handleDeleteComment, postId }: PostCommentsProps) => {
    const { data: comments } = useGetPostCommentsQuery(postId);

    let sortedComments = [...comments || []].sort((a, b) => a.id - b.id);

    return (
        <div style={{ padding: '0 1rem 1rem' }}>
            {
                (sortedComments && sortedComments.length > 0)
                    ? sortedComments.map((comment, i) =>
                        <Box key={comment.id}>
                            <SinglePostComment i={i} postId={postId} {...comment} handleDeleteComment={handleDeleteComment} />
                            <div style={{ backgroundColor: '#f4f4f4', height: '1px' }}></div>
                        </Box>)
                    : <p>Няма коментари все още</p>
            }
        </div>
    )
}

export default PostComments;