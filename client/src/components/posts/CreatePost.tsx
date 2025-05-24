import { ChangeEvent, MouseEvent, useContext, useState } from 'react';
import { Alert, Backdrop, Button, Collapse, Fade, Modal, TextField, Tooltip } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import IconButton from '@mui/material/IconButton';
import { PermMedia } from "@mui/icons-material"
import YouTubeIcon from '@mui/icons-material/YouTube';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../../context/AuthContext';
import { AppContext } from '../../context/AppContext';
import { API, YOUTUBE_EMBED, YOUTUBE_REGEX } from '../../common/constants';
import { createPost, getUserPosts } from '../../services/requests';
import "./CreatePost.css";
import { Box } from '@mui/system';
import YouTube from "../embed/YouTube";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  background: '#fff'
};

type Form = {
  content: string;
  isPublic: string;
  embed: string;
  file: string | Blob;
}

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const { setPosts } = useContext(AppContext);
  const [formFields, setFormFields] = useState<Form>({
    "content": "",
    "isPublic": "true",
    "embed": "",
    "file": "",
  });
  const [publishDisabled, setPublishDisabled] = useState(true);
  const [isPublic, setIsPublic] = useState(true);
  const [openVideo, setOpenVideo] = useState(false);
  const [addVideoDisabled, setAddVideoDisabled] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarState, setSnackbarState] = useState(false);

  const handleVideoClose = () => {
    setOpenVideo(false);
  };

  const handleVideoDelete = () => {
    setFormFields({ ...formFields, embed: "" });
    setOpenVideo(false);
  };

  const handleVideoOpen = () => {
    setOpenVideo(true);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {

    if (e.target.name === "content" && (e.target.value.length < 10 || e.target.value.length > 5000)) {
      setPublishDisabled(true);
    } else {
      setPublishDisabled(false);
    }

    setFormFields({ ...formFields, [e.target.name]: e.target.value, isPublic: String(isPublic) });
  }

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === "embed" && e.target.value.length < 43) {
      return setAddVideoDisabled(true);
    } else {
      setAddVideoDisabled(false);
    }

    const match = (YOUTUBE_REGEX).exec(e.target.value);
    if (!match) return;
    const embed = YOUTUBE_EMBED + match[1];
    setFormFields({ ...formFields, [e.target.name]: embed });
  }

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    if (!/\.(jpg|jpeg|png|gif)$/i.test(e.target.files[0]?.name)) {
      setErrors({ ...errors, [e.target.name]: 'Поддържани формати PNG/JPG/GIF' });
      return setSnackbarState(true);
    }

    setSnackbarState(false);
    delete errors[e.target.name];
    setErrors({ ...errors });

    setFormFields({ ...formFields, file: e.target.files[0] });
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const formData = new FormData();

    if ((!formFields.content) || (formFields.content.length < 10) || (formFields.content.length > 5000)) {
      return alert('Моля добавете съдържание.');
    } else {
      formData.append('content', formFields.content);
      formData.append('isPublic', formFields.isPublic);
    }

    if (formFields.embed) {
      formData.append('embed', formFields.embed);
    }

    if (formFields.file) {
      formData.append('file', formFields.file);
    }

    if (await createPost(formData)) {
      setPosts(await getUserPosts(user.id));
    } else {
      return alert('Мрежова грешка. Моля опитайте по-късно.');
    }
  }

  return (
    <div className="form-create-post">
      <div className="share">
        <div className="shareWrapper">
          <div className="shareTop">
            <img className="shareProfileImg" src={`${API}/${user.avatar}`} alt="" />
            <input
              placeholder={`Нова дискусия ли ви води насам, ${user.username}?`}
              className="shareInput"
              name="content"
              onChange={(e) => handleChange(e)}
            />
          </div>
          {formFields.embed && <YouTube url={formFields.embed} />}
          <hr className="shareHr" />
          <div className="shareBottom">
            <div className="shareOptions">
              <div className="shareOption" style={{ position: 'relative', cursor: 'pointer' }}>
                <input
                  type="file"
                  className="shareInput"
                  name="file"
                  onChange={(e) => handleFile(e)}
                  style={{
                    height: '3rem',
                    position: 'absolute',
                    width: '100%',
                    opacity: '0'
                  }}
                />
                <Tooltip title="Прикачи снимка" arrow >
                  <IconButton>
                    <PermMedia htmlColor="tomato" className="shareIcon" />
                  </IconButton>
                </Tooltip>
                <span className="shareOptionText">Снимка</span>
              </div>
              <div className="shareOption" style={{ position: 'relative', cursor: 'pointer' }} onClick={() => handleVideoOpen()}>
                <Tooltip title="Прикачи видео" arrow >
                  <YouTubeIcon htmlColor="tomato" className="shareIcon" />
                </Tooltip>
                <span className="shareOptionText">Видео</span>
              </div>
              <div className="shareOption" onClick={() => setIsPublic(!isPublic)}>
                {
                  isPublic
                    ? <Tooltip title="Публично" arrow >
                      <IconButton>
                        <LockOpenIcon fontSize="small" color="action" />
                      </IconButton>
                    </Tooltip>

                    : <Tooltip title="Само приятели" arrow>
                      <IconButton>
                        <LockIcon fontSize="small" color="action" />
                      </IconButton>
                    </Tooltip>
                }
                <span className="shareOptionText">Видимост</span>
              </div>
            </div>
            <Button
              sx={{ marginRight: '20px' }}
              variant="contained"
              disabled={publishDisabled}
              className="shareButton"
              onClick={(e) => handleSubmit(e)}>Публикувай</Button>
          </div>
        </div>
      </div>

      <Collapse sx={{ m: 1 }} in={snackbarState}>
        <Alert
          severity="error"
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSnackbarState(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {errors.file}
        </Alert>
      </Collapse>

      <Modal
        aria-labelledby="update-post-modal-title"
        aria-describedby="update-post-modal-description"
        open={openVideo}
        onClose={handleVideoClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openVideo}>
          <Box
            component="form"
            sx={{
              ...style,
              '& .MuiTextField-root': { mb: 1, width: '100%' },
            }}
            noValidate
            autoComplete="off"
          >

            <TextField
              placeholder="Линк към YouTube"
              focused
              type="text"
              color="success"
              error={false}
              id="form-post-embed"
              label="Видео"
              name="embed"
              value={formFields.embed}
              helperText="(по избор)"
              onChange={(e) => handleVideoChange(e)}
            />

            <Button
              sx={{ m: 1 }}
              variant="outlined"
              onClick={() => setOpenVideo(false)}
              disabled={addVideoDisabled}
            >
              Добави
            </Button>

            <Button
              sx={{ m: 1 }}
              variant="outlined"
              onClick={handleVideoDelete}
            >
              Изтрий
            </Button>

            <Button
              sx={{ m: 1 }}
              variant="outlined"
              onClick={handleVideoClose}
            >
              Затвори
            </Button>


          </Box>

        </Fade>
      </Modal>

    </div>
  );
}

export default CreatePost;