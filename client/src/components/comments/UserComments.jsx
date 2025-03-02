import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { getUserComments } from "../../services/requests";
import SingleUserComment from "./SingleUserComment";

const UserComments = () => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        (async () => {
            setComments(await getUserComments());
        })()
    }, [setComments])

    return (
        <>
            <h2>Лични реплики</h2>
            <Box sx={{ background: '#fff', padding: '1rem', borderRadius: '10px' }}>
                {
                    (comments && comments.length > 0)
                        ? comments.map((comment, i) =>
                            <Box key={comment.id}>
                                <SingleUserComment i={i} {...comment} />
                                <div style={{ backgroundColor: '#f4f4f4', height: '1px' }}></div>
                            </Box>
                        )
                        : <p>Нямате лични реплики все още</p>
                }
            </Box>
        </>
    )
}

export default UserComments;