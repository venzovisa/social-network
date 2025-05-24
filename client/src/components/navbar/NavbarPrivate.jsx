import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Grid, SwipeableDrawer } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import PeopleIcon from '@mui/icons-material/People';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import { motion } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext.ts';
import { API } from '../../common/constants.ts';
import { useHistory } from 'react-router';
import { AppContext } from '../../context/AppContext.ts';
import WebsiteLogo from '../navbar/WebsiteLogo.jpg';
import scrollToTop from '../../common/scrollToTop.ts';
import SidebarPrivate from '../../views/sidebar/SidebarPrivate.jsx';

const NavbarPrivate = () => {
    const { user } = useContext(AuthContext);
    const { setSearchQuery } = useContext(AppContext);
    const [searchInput, setSearchInput] = useState('');
    const history = useHistory();
    const [drawerState, setDrawerState] = useState(false);

    const toggleDrawer = (open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setDrawerState(open);
    };

    const pendingFriends = user?.friends?.filter(u => u.friendshipStatus === 1 && u.canAcceptFriendship).length;

    const handleSearch = (e) => {
        setSearchInput(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if (searchInput.length > 0) {
            setSearchQuery(searchInput);
            setSearchInput('');
            history.push('/users/search');
        }
    }

    return (
        <nav className="navbar">
            <Grid container alignItems="center" sx={{ position: 'relative' }}>
                <Grid item xs={3} md={2} xl={4} sx={{ order: '1' }}>
                    <motion.img
                        drag
                        initial={{ scale: 1 }} animate={{ scale: 1.2 }}
                        transition={{ yoyo: Infinity, duration: 1 }}
                        className="website-logo"
                        src={WebsiteLogo}
                        alt="Website logo"
                        width="120px"
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4} xl={4} sx={{ textAlign: "center", order: { xs: '3', md: '2' } }}>

                    <Paper
                        component="form"
                        sx={{
                            p: '2px 8px',
                            display: 'flex',
                            margin: '0 auto',
                            alignItems: 'center',
                            maxWidth: 400,
                            borderRadius: '2rem'
                        }}
                        onSubmit={(e) => handleSubmit(e)}
                    >
                        <InputBase
                            sx={{ ml: 1, flex: 1 }}
                            placeholder="Търсене на политици..."
                            inputProps={{ 'aria-label': 'search google maps' }}
                            value={searchInput}
                            onChange={(e) => handleSearch(e)}
                        />
                        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                </Grid>
                <Grid item xs={9} md={6} lg={6} xl={4} sx={{ paddingLeft: 2, order: { xs: '2', md: '3' } }}>
                    <Stack direction="row" spacing={4} sx={{ justifyContent: "right", alignItems: "center" }}>
                        <strong>Привет, {user.username}</strong>
                        <Badge color="secondary" onClick={() => { scrollToTop(); history.push('/users/requests'); }} badgeContent={pendingFriends}>
                            <IconButton size="small" >
                                <PeopleIcon sx={{ color: '#000' }} />
                            </IconButton>
                        </Badge>
                        <Link to={`/users/profile/${user.id}`} onClick={() => scrollToTop()}>
                            <IconButton size="small" sx={{ ml: 2 }}>
                                {
                                    user?.avatar &&
                                    <Avatar alt={`${user.username}`} src={`${API}/${user.avatar}`} />
                                }
                            </IconButton>
                        </Link>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'inline-flex', md: 'none' }
                            }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                    </Stack>
                </Grid>
            </Grid>

            <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
            >
                <SwipeableDrawer
                    anchor="right"
                    open={drawerState}
                    onClose={toggleDrawer(false)}
                    onOpen={toggleDrawer(true)}
                >
                    <SidebarPrivate />
                </SwipeableDrawer>
            </Box>
        </nav>
    )
}

export default NavbarPrivate;









