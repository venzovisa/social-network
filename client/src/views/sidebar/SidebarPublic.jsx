import { Link } from "react-router-dom";
import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LoginIcon from '@mui/icons-material/Login';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import Login from "../../components/users/Login";
import Register from "../../components/users/Register";
import scrollToTop from "../../common/scrollToTop";

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
};

const btnStyle = {
    justifyContent: 'flex-start'
}

const linkStyle = {
    textDecoration: 'none'
}

const sidebarStyle = {
    padding: 1,
    position: { md: 'fixed' }
}

const SidebarPublic = () => {
    const [openLogin, setOpenLogin] = React.useState(false);
    const [openRegister, setOpenRegister] = React.useState(false);
    const handleLoginOpen = () => setOpenLogin(true);
    const handleLoginClose = () => setOpenLogin(false);
    const handleRegisterOpen = () => setOpenRegister(true);
    const handleRegisterClose = () => setOpenRegister(false);

    return (
        <Box component="aside" sx={sidebarStyle}>
            <p>
                <Link style={linkStyle} to="/" onClick={() => scrollToTop()}>
                    <Button startIcon={<AssessmentIcon />} sx={btnStyle}>
                        <span className="btn-text">Популярни</span>
                    </Button>
                </Link>
            </p>
            <p>
                <Link style={linkStyle} to="/users" onClick={() => scrollToTop()}>
                    <Button startIcon={<SupervisedUserCircleIcon />} sx={btnStyle}>
                        <span className="btn-text">Политици</span>
                    </Button>
                </Link>
            </p>
            <p>
                <Button startIcon={<LoginIcon />} sx={btnStyle} onClick={handleLoginOpen}>
                    <span className="btn-text">Вписване</span>
                </Button>
            </p>
            <p>
                <Button startIcon={<VpnKeyIcon />} sx={btnStyle} onClick={handleRegisterOpen}>
                    <span className="btn-text">Регистрация</span>
                </Button>
            </p>

            <Modal
                aria-labelledby="login-modal-title"
                aria-describedby="login-modal-description"
                open={openLogin}
                onClose={handleLoginClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openLogin}>
                    <Box sx={style}>
                        <Login handleCloseModal={handleLoginClose} />
                    </Box>
                </Fade>
            </Modal>

            <Modal
                aria-labelledby="register-modal-title"
                aria-describedby="register-modal-description"
                open={openRegister}
                onClose={handleRegisterClose}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={openRegister}>
                    <Box sx={style}>
                        <Register handleCloseModal={handleRegisterClose} />
                    </Box>
                </Fade>
            </Modal>
        </Box>
    )
}

export default SidebarPublic;