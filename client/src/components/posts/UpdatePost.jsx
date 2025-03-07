import { React, useState, forwardRef, useEffect } from 'react';
import { Button } from '@mui/material';
import { updatePost } from '../../services/requests';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { YOUTUBE_EMBED, YOUTUBE_REGEX } from '../../common/constants';
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function UpdatePost({ handleCloseModal, handleUpdatePost, id, content }) {
  const [formFields, setFormFields] = useState({ content: content || '', isPublic: 'true' });
  const [snackbarState, setSnackbarState] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [publishDisabled, setPublishDisabled] = useState(true);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (formFields.content.length < 10) {
      setPublishDisabled(true);
    } else {
      setPublishDisabled(false);
    }

  }, [formFields.content.length])

  const handleOpen = () => {
    setSnackbarState(true);
  };

  const handleClose = () => {
    setSnackbarState(false);
  };

  const handleChange = (e) => {

    if (e.target.name === "content" && e.target.value.length < 10) {
      setPublishDisabled(true);
    } else {
      setPublishDisabled(false);
    }

    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  }

  const handleFile = (e) => {
    setFormFields({ ...formFields, file: e.target.files[0] });
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formFields.content === '') {
      setSnackbarMessage('Попълнете задължителните полета');
      handleOpen();
      return;
    }

    const formData = new FormData();
    formData.append('content', formFields.content);
    formData.append('isPublic', formFields.isPublic);

    if (formFields.embed) {
      const embed = YOUTUBE_EMBED + (YOUTUBE_REGEX).exec(formFields.embed)[1];
      formData.append('embed', embed);
    }

    if (formFields.file) {
      formData.append('file', formFields.file);
    }

    const response = await updatePost(id, formData);

    if (response?.id === id) {
      handleCloseModal();
      handleUpdatePost(id);
      return;
    }

    if (!response || response.status === 400) {
      setSnackbarMessage('Мрежова грешка. Моля опитайте по-късно.');
    }

    handleOpen();
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { mb: 1, width: '100%' },
        }}
        noValidate
        autoComplete="off"
      >

        <TextField
          value={formFields.content}
          multiline
          minRows={4}
          maxRows={20}
          autoComplete="content"
          required
          type="text"
          color="success"
          id="form-post-content"
          label="Съдържание"
          name="content"
          helperText=""
          onChange={(e) => handleChange(e)}
        />

        <TextField
          focused
          type="file"
          color="success"
          error={false}
          id="form-user-image"
          label="Снимка"
          name="file"
          defaultValue=""
          helperText="(по избор)"
          onChange={(e) => handleFile(e)}
        />

        <TextField
          placeholder="Линк към YouTube"
          focused
          type="text"
          color="success"
          error={false}
          id="form-user-embed"
          label="Видео"
          name="embed"
          helperText="(по избор)"
          onChange={(e) => handleChange(e)}
        />

        <div>
          {
            isPublic
              ?
              <Button sx={{ m: 1 }}
                variant="outlined"
                startIcon={<LockOpenIcon fontSize="small" color="action" />}
                onClick={() => setIsPublic(false)}
              >
                Публично
              </Button>
              :
              <Button sx={{ m: 1 }}
                variant="outlined"
                startIcon={<LockIcon fontSize="small" color="action" />}
                onClick={() => setIsPublic(true)}
              >
                Само приятели
              </Button>
          }
        </div>

        <Button
          sx={{ m: 1 }}
          variant="outlined"
          onClick={(e) => handleSubmit(e)}
          disabled={publishDisabled}
        >
          Актуализирай
        </Button>

        <Button
          sx={{ m: 1 }}
          variant="outlined"
          onClick={() => handleCloseModal()}
        >
          Затвори
        </Button>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={snackbarState}
        onClose={handleClose}
        key="bottom-center"
        autoHideDuration={3000}
      >
        <Alert severity="error">{snackbarMessage}</Alert>
      </Snackbar>

    </>
  );
}