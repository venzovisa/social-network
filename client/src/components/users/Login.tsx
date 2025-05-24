import { useState, useContext, forwardRef, useEffect, FocusEvent, ChangeEvent, MouseEvent } from 'react';
import { LoadingButton } from '@mui/lab';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { login } from '../../services/requests';
import { AuthContext } from '../../context/AuthContext';
import jwt from 'jsonwebtoken';
import scrollToTop from '../../common/scrollToTop';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Login({ handleCloseModal }: { handleCloseModal: () => void }) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { setLoginStatus, setUser } = useContext(AuthContext);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [snackbarState, setSnackbarState] = useState(false);
  const [loginDisabled, setLoginDisabled] = useState(true);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {

    const usernameIsValid = (formData.username.length > 3 && formData.username.length < 26);
    const passwordIsValid = (formData.password.length > 5 && formData.password.length < 26);

    if (usernameIsValid && passwordIsValid && Object.keys(errors).length === 0) {
      setLoginDisabled(false);
    }
    else {
      setLoginDisabled(true);
    }

    return () => { }

  }, [formData.username.length, formData.password.length, errors])

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

    if (e.target.value.length > 25) {
      return setErrors({ ...errors, [e.target.name]: 'Максимална дължина 25 символа' });
    }

    delete errors[e.target.name];
    setErrors({ ...errors });
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoadingState(true);
    const token = await login(formData);

    if (token) {
      localStorage.setItem('token', token);
      setLoginStatus(true);
      setUser(jwt.decode(token));
      handleCloseModal();
      setLoadingState(false);
      scrollToTop();
    }

    setLoadingState(false);
    handleOpen();
  }

  return (
    <div className="user-form-login">

      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, display: 'block' },
          '& .MuiInputBase-root': { display: 'block' }
        }}
        noValidate
        autoComplete="on"
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
          autoComplete="current-password"
          required
          type="password"
          color="success"
          error={errors.password ? true : false}
          id="form"
          label="Парола"
          name="password"
          helperText={errors.password || ' '}
          onChange={(e) => handleChange(e)}
          onBlur={(e) => handleValidation(e)}
        />
        <LoadingButton
          loading={loadingState}
          disabled={loginDisabled}
          sx={{ m: 1 }}
          type="submit"
          variant="outlined"
          onClick={(e) => handleSubmit(e)} >Вписване</LoadingButton>
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
          Грешно име или парола!
        </Alert>
      </Collapse>
    </div>
  );
}
