import { Avatar, Button } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { API } from "../../common/constants";
import { getUserDetails, getUserPosts, updateUser } from "../../services/requests";
import SinglePost from "../posts/SinglePost";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { AuthContext } from "../../context/AuthContext";

const UserProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [userCurrent, setUserCurrent] = useState({});
    const [formFields, setFormFields] = useState({ file: '' });
    const [renderUpload, setRenderUpload] = useState(false);
    const params = useParams();

    const handleFile = async (e) => {
        setFormFields({ ...formFields, file: e.target.files[0] });
    }

    const handleSubmit = async (e) => {
        const formData = new FormData();
        formData.append('file', formFields.file);
        await updateUser(formData);
        const userDetails = await getUserDetails(params.id);

        if (userDetails) {
            setUserCurrent(userDetails);
            setUser(userDetails);
        } else {
            alert("Нещо се обърка");
        }
    }

    useEffect(() => {
        (async () => {
            setPosts(await getUserPosts(params.id));
            setUserCurrent(await getUserDetails(params.id));
        })();
        return () => { }
    }, [params.id, posts]);

    return (
        <>
            <h2>Досие</h2>
            <div style={{ textAlign: 'center' }}>
                {
                    userCurrent?.avatar &&
                    <Avatar
                        sx={{ width: 192, height: 192, margin: '0 auto' }}
                        alt={`${userCurrent?.username}`}
                        src={`${API}/${userCurrent?.avatar}`}
                    />
                }

                {/* {
                    !userCurrent.latitude && 
                        <div style={{ margin: '1rem' }} >
                            <Chip 
                                color={rating > 0 ? "success" : "warning"} 
                                avatar={<Avatar>{rating}</Avatar>} 
                                label="Рейтинг"
                            />
                        </div>
                } */}

                {
                    (user.id === userCurrent.id || user.role === 2) &&
                    <p>
                        <Button
                            variant="contained"
                            onClick={() => setRenderUpload(!renderUpload)}
                            startIcon={<AddPhotoAlternateIcon />}
                        >
                            Промени профилна снимка</Button>
                    </p>
                }

                {
                    renderUpload && <><Button variant="contained" >
                        <input name="file" type="file" onChange={(e) => handleFile(e)} />
                    </Button>
                        <p>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => handleSubmit()}
                            >Качи снимка
                            </Button>
                        </p>
                    </>
                }
                <p>
                    <a
                        href={`http://mailto:${userCurrent.email}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: 'none' }} >
                        <Button
                            variant="contained"
                            startIcon={<EmailIcon />}>Съобщение</Button>
                    </a>
                </p>
            </div>
            {
                posts?.length > 0 && posts.map(post => <SinglePost key={post.id} {...post} setPosts={setPosts} />)
            }
        </>
    )
}
export default UserProfile;