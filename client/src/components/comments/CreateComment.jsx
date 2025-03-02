import { React, useContext, useState } from 'react';
import { Button } from '@mui/material';
import { createComment, getUserPosts } from '../../services/requests';
import Grid from '@mui/material/Grid';
import "./CreateComment.css";
import { AuthContext } from '../../context/AuthContext';
import { API } from '../../common/constants';
import { AppContext } from '../../context/AppContext';

const CreateComment = ({ id }) => {
  const { user } = useContext(AuthContext);
  const { setPosts } = useContext(AppContext);
  const [formFields, setFormFields] = useState({
    "content": "string",
  });
  const [publishDisabled, setPublishDisabled] = useState(true);


  const handleChange = (e) => {
    if (e.target.value.length < 10 || e.target.value.length > 500) {
      setPublishDisabled(true);
    } else {
      setPublishDisabled(false);
    }

    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e, id) => {
    e.preventDefault();

    console.log(formFields)
    if (await createComment(id, formFields)) {
      setPosts(await getUserPosts());
    } else {
      return alert('Мрежова грешка. Моля опитайте по-късно.');
    }
  }

  return (
    <div style={{ padding: '1rem' }}>

      <div className="shareComment">
        <div className="shareWrapper">
          <Grid container alignItems="center">
            <Grid item xs={9} sx={{ paddingLeft: 2, order: { xs: '2', md: '3' } }}>
              <div className="shareTop">
                <img className="shareCommentImg" src={`${API}/${user.avatar}`} alt="" />
                <input
                  placeholder={`Напишете вашата реплика, ${user.username}?`}
                  className="shareInput"
                  name="content"
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </Grid>

            <Grid item xs={3} sx={{ paddingLeft: 2, order: { xs: '2', md: '3' } }}>
              <div className="shareBottom">
                <Button sx={{ fontSize: '0.6rem' }} size="small"
                  variant="contained"
                  disabled={publishDisabled}
                  className="shareButton"
                  onClick={(e) => handleSubmit(e, id)}>Добави</Button>
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default CreateComment;