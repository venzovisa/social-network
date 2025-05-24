import { useState, useContext, forwardRef, FocusEvent, ChangeEvent, MouseEvent } from 'react';
import { Button, Collapse, IconButton, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { logout, register } from '../../services/requests';
import { AuthContext } from '../../context/AuthContext';
const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref: any) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
export default function Register({ handleCloseModal }: { handleCloseModal: () => void }) {
  document.title = "Register";
  const { setLoginStatus } = useContext(AuthContext);
  const [formFields, setFormFields] = useState({ username: '', password: '', email: '', latitude: '', longitude: '', file: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarState, setSnackbarState] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleOpen = () => {
    setSnackbarState(true);
  };

  const handleValidation = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
    if (e.target.name === 'username' && Number.isFinite(+e.target.value[0])) {
      return setErrors({ ...errors, [e.target.name]: "Не може да започва с число" });
    }

    if (e.target.name === "username" && e.target.value.length < 4) {
      return setErrors({ ...errors, username: 'Минимална дължина 4 символа' });
    }

    if (e.target.name === "password" && e.target.value.length < 6) {
      return setErrors({ ...errors, password: 'Минимална дължина 6 символа' });
    }

    if (e.target.name === "email" && e.target.value.length < 10) {
      return setErrors({ ...errors, email: 'Задължително поле' });
    }

    if (e.target.value.length > 25) {
      return setErrors({ ...errors, [e.target.name]: 'Максимална дължина 25 символа' });
    }

    delete errors[e.target.name];
    setErrors({ ...errors });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    setFormFields({ ...formFields, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0 ||
      formFields.username === '' ||
      formFields.password === '' ||
      formFields.email === '') {
      setSnackbarMessage('Моля попълнете задължителните полета');
      handleOpen();
      return;
    }

    const formData = new FormData();
    formData.append('username', formFields.username);
    formData.append('password', formFields.password);
    formData.append('file', formFields.file);
    formData.append('email', formFields.email);
    formData.append('latitude', formFields.latitude);
    formData.append('longitude', formFields.longitude);
    const response = await register(formFields);

    if (response?.username === formFields.username) {
      await logout();
      setLoginStatus(false);
      document.title = "Home";
      handleCloseModal();
      return;
    }

    if (!response || response.status === 400) {
      setSnackbarMessage('Невалидни данни');
    }

    handleOpen();
  }

  return (
    <div className="user-form-register">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { mb: 1, width: '100%' },
          '& .MuiSelect-root': { width: '100%', mb: 3 }
        }}
        noValidate
        autoComplete="off"
      >

        <TextField
          autoComplete="nickname"
          required
          type="text"
          color="success"
          error={errors.username ? true : false}
          id="form-user-name"
          label="Име"
          name="username"
          helperText={errors.username || ' '}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => handleValidation(e)}
        />

        <TextField
          autoComplete="new-password"
          required
          type="password"
          color="success"
          error={errors.password ? true : false}
          id="form-user-password"
          label="Парола"
          name="password"
          helperText={errors.password || ' '}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => handleValidation(e)}
        />

        <TextField
          autoComplete="email"
          required
          type="email"
          color="success"
          error={errors.email ? true : false}
          id="form-user-email"
          label="Електронен адрес"
          name="email"
          helperText={errors.email || ' '}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => handleValidation(e)}
        />
        <Select
          labelId="select-status"
          id="select-status"
          value={formFields.latitude}
          name="latitude"
          defaultValue={'0'}
          displayEmpty={true}
          onChange={handleChange}
        >
          <MenuItem value={1}>Потребител</MenuItem>
          <MenuItem value={0}>Политик</MenuItem>
        </Select>
        <Select
          labelId="political-orientation"
          id="political-orientation"
          value={formFields.longitude}
          name="longitude"
          defaultValue={'0'}
          displayEmpty={true}
          onChange={handleChange}
        >
          <MenuItem value={0}>Неутрален</MenuItem>
          <MenuItem value={1}>Социалист</MenuItem>
          <MenuItem value={2}>Демократ</MenuItem>
          <MenuItem value={3}>Националист</MenuItem>
        </Select>
        {/* <TextField
                focused
                type="file"
                color="success"
                error={false}
                id="form-user-avatar"
                label="Снимка"
                name="avatar"
                defaultValue=""
                helperText="(по избор)"         
                // onChange={(e) => handleFile(e)}
            /> */}

        <Button sx={{ mb: 2 }} variant="outlined" onClick={(e) => handleSubmit(e)}>Регистриране</Button>
      </Box>

      <Collapse sx={{ mb: 1 }} in={snackbarState}>
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

      {/* <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={snackbarState}
            onClose={handleClose}
            key="bottom-center"
            autoHideDuration={3000}
        >
            <Alert severity="error">{snackbarMessage}</Alert>
        </Snackbar> */}

    </div>
  );
}