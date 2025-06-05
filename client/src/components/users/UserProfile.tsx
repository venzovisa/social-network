import { ChangeEvent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { Avatar, Button } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';
import { API } from "../../common/constants";
import SinglePost from "../posts/SinglePost";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { AuthContext } from "../../context/AuthContext";
import { useGetPostsQuery, useGetUserDetailsQuery, useUpdateUserMutation } from "../../api/apiSlice";

/*
{
    "id": 42,
    "username": "test2",
    "email": "test2@test.com",
    "role": 1,
    "avatar": "mood-tracker-136276c159c22219.jpg",
    "latitude": 1,
    "longitude": 0,
    "banDate": null,
    "banReason": null,
    "lastUpdated": "2025-05-20T14:07:52.000Z",
    "friends": []
}
*/

const UserProfile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [formFields, setFormFields] = useState<{ file: Blob | string }>({ file: '' });
    const [renderUpload, setRenderUpload] = useState(false);
    const params = useParams<{ id: string }>();
    const { data: posts } = useGetPostsQuery(user.id);
    const { data: currentUser } = useGetUserDetailsQuery(params.id);
    const [updateUser] = useUpdateUserMutation();

    const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        setFormFields({ ...formFields, file: e.target.files[0] });
    }

    const handleSubmit = async () => {
        const formData = new FormData();
        formData.append('file', formFields.file);
        await updateUser(formData);

        if (currentUser) {
            setUser(currentUser);
        } else {
            alert("Нещо се обърка");
        }
    }

    return (
        <>
            <h2>Досие</h2>
            <div style={{ textAlign: 'center' }}>
                {
                    currentUser?.avatar &&
                    <Avatar
                        sx={{ width: 192, height: 192, margin: '0 auto' }}
                        alt={`${currentUser?.username}`}
                        src={`${API}/${currentUser?.avatar}`}
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
                    (user.id === currentUser?.id || user.role === 2) &&
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
                        href={`http://mailto:${currentUser?.email}`}
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
                posts && posts?.length > 0 && posts.map(post => <SinglePost key={post.id} {...post} />)
            }
        </>
    )
}
export default UserProfile;