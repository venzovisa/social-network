import { useState, forwardRef, useEffect } from 'react';
import { Button, Collapse, IconButton } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import MuiAlert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { useUpdateCommentMutation } from '../../api/apiSlice';
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function UpdateComment({ handleCloseModal, id, content }) {
  const [formFields, setFormFields] = useState({ content });
  //const [errors, setErrors] = useState({});
  const [snackbarState, setSnackbarState] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(false);
  const [publishDisabled, setPublishDisabled] = useState(true);
  const [updateComment] = useUpdateCommentMutation();
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

  const handleChange = (e) => {

    if (e.target.name === "content" && e.target.value.length < 10) {
      setPublishDisabled(true);
    } else {
      setPublishDisabled(false);
    }

    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formFields.content === '') {
      return handleOpen();
    }

    const response = await updateComment({ id, ...formFields }).unwrap();

    if (response?.id === id) {
      handleCloseModal();
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
          id="form-comment-content"
          label="Съдържание"
          name="content"
          helperText=""
          onChange={(e) => handleChange(e)}
        />

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
          {snackbarMessage}
        </Alert>
      </Collapse>
    </>
  );
}