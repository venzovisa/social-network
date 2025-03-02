import { Link, useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import AssessmentIcon from '@mui/icons-material/Assessment';
import RssFeedIcon from '@mui/icons-material/RssFeed';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { logout } from "../../services/requests";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Box } from "@mui/system";
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import scrollToTop from "../../common/scrollToTop";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { motion } from 'framer-motion';

const btnStyle = {
    justifyContent: 'flex-start',
    width: '100%'
}

const linkStyle = {
    textDecoration: 'none'
}

const sidebarStyle = {
    padding: 1,
    position: { md: 'fixed' }
}

const SidebarPrivate = () => {
    const { user, setUser } = useContext(AuthContext);
    const { setLoginStatus } = useContext(AuthContext);
    const history = useHistory();

    const handleLogout = async () => {
        history.push('/')
        setUser({ ...user, longitude: 0 });
        await logout();
        localStorage.removeItem('token');
        setLoginStatus('false');
    }

    return (
        <Box component="aside" sx={sidebarStyle}>
            <p>
                <Link style={linkStyle} to="/" onClick={() => scrollToTop()}>
                    <motion.div
                        drag
                        whileHover={{ scale: 1.2, originX: 0 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: '800' }}>
                        <Button variant="contained" sx={btnStyle} startIcon={<AssessmentIcon />}>
                            <span className="btn-text">Популярни</span>
                        </Button>
                    </motion.div>
                </Link>
            </p>
            <p>
                <Link style={linkStyle} to="/feed" onClick={() => scrollToTop()}>
                    <motion.div drag
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.2, originX: 0 }}
                        transition={{ type: 'spring', stiffness: '800' }}>
                        <Button variant="contained" sx={btnStyle} startIcon={<RssFeedIcon />}>
                            <span className="btn-text">Дебати</span>
                        </Button>
                    </motion.div>
                </Link>
            </p>
            <p>
                <Link style={linkStyle} to="/users" onClick={() => scrollToTop()}>
                    <motion.div drag
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.2, originX: 0 }}
                        transition={{ type: 'spring', stiffness: '800' }}>

                        <Button variant="contained" sx={btnStyle} startIcon={<AttachMoneyIcon />}>
                            <span className="btn-text">Политици</span>
                        </Button>
                    </motion.div>
                </Link>
            </p>
            <p>
                <Link style={linkStyle} to="/users/people" onClick={() => scrollToTop()}>
                    <motion.div drag
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.2, originX: 0 }}
                        transition={{ type: 'spring', stiffness: '800' }}>
                        <Button variant="contained" sx={btnStyle} startIcon={<SupervisedUserCircleIcon />}>
                            <span className="btn-text">Потребители</span>
                        </Button>
                    </motion.div>
                </Link>
            </p>
            <p>
                <Link style={linkStyle} to="/users/friends" onClick={() => scrollToTop()}>
                    <motion.div drag whileHover={{ scale: 1.2, originX: 0 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: '800' }}>
                        <Button variant="contained" sx={btnStyle} startIcon={<EmojiPeopleIcon />}>
                            <span className="btn-text">Приятели</span>
                        </Button>
                    </motion.div>
                </Link>
            </p>
            {!user.latitude && <><p>
                <Link style={linkStyle} to="/posts" onClick={() => scrollToTop()}>
                    <motion.div drag
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.2, originX: 0 }}
                        transition={{ type: 'spring', stiffness: '800' }}>
                        <Button variant="contained" sx={btnStyle} startIcon={<ChatBubbleIcon />}>
                            <span className="btn-text">Лични Публикации</span>
                        </Button>
                    </motion.div>
                </Link>
            </p>
                <p>
                    <Link style={linkStyle} to="/users/comments" onClick={() => scrollToTop()}>
                        <motion.div drag whileHover={{ scale: 1.2, originX: 0 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: '800' }}>
                            <Button variant="contained" sx={btnStyle} startIcon={<QuestionAnswerIcon />}>
                                <span className="btn-text">Лични Реплики</span>
                            </Button>
                        </motion.div>
                    </Link>
                </p></>}
            <p>
                <motion.div drag
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.2, originX: 0 }}
                    transition={{ type: 'spring', stiffness: '800' }}>
                    <Button variant="contained" sx={btnStyle} startIcon={<ExitToAppIcon />} onClick={() => handleLogout()}>
                        <span className="btn-text">Отписване</span>
                    </Button>
                </motion.div>
            </p>
        </Box>
    )
}

export default SidebarPrivate;