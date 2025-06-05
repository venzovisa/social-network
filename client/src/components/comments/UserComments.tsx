import { Box } from "@mui/system";
import SingleUserComment from "./SingleUserComment";
import { useGetUserCommentsQuery } from "../../api/apiSlice";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

const UserComments = () => {
    const { user } = useContext(AuthContext);
    const { data } = useGetUserCommentsQuery(user.id);
    console.log("Comments", data);

    return (
        <>
            <h2>Лични реплики</h2>
            <Box sx={{ background: '#fff', padding: '1rem', borderRadius: '10px' }}>
                {
                    (data && data.length > 0)
                        ? data.map((comment, i) =>
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