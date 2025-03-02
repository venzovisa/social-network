import { Box } from "@mui/system";
import { useState } from "react";
import SinglePostComment from "./SinglePostComment";

const PostComments = ({ comments, handleDeleteComment, postId }) => {
    const [comms, setComms] = useState(comments)

    let sortedComments = [...comms].sort((a, b) => a.id - b.id);

    return (
        <div style={{ padding: '0 1rem 1rem' }}>
            {
                (sortedComments && sortedComments.length > 0)
                    ? sortedComments.map((comment, i) =>
                        <Box key={comment.id}>
                            <SinglePostComment i={i} postId={postId} setComms={setComms} {...comment} handleDeleteComment={handleDeleteComment} />
                            <div style={{ backgroundColor: '#f4f4f4', height: '1px' }}></div>
                        </Box>)
                    : <p>Няма коментари все още</p>
            }
        </div>
    )
}

export default PostComments;