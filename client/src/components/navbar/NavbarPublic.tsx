import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { Grid, SwipeableDrawer } from '@mui/material';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { Box } from '@mui/system';
import SidebarPublic from '../../views/sidebar/SidebarPublic';
import { AppContext } from '../../context/AppContext';

const NavbarPublic = () => {
    const { setSearchQuery } = useContext(AppContext);
    const [searchInput, setSearchInput] = useState('');
    const history = useHistory();
    const [drawerState, setDrawerState] = useState(false);

    const toggleDrawer = (open: boolean) => (event: KeyboardEvent) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setDrawerState(open);
    };


    const handleSearch = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchInput(e.target.value);
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (searchInput.length > 0) {
            setSearchQuery(searchInput);
            setSearchInput('');
            history.push('/users/search');
        }
    }

    return (
        <nav className="navbar">
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={3}>
                    <Stack direction="row" spacing={2}>
                    </Stack>
                </Grid>
                <Grid item xs={6} sx={{ textAlign: "center" }}>
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
                <Grid item xs={3}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{
                            mr: 2,
                            display: { xs: 'inline-flex', md: 'none' }
                        }}
                        onClick={() => toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Grid>
            </Grid>

            <Box
                sx={{ width: 250 }}
                role="presentation"
            >
                <SwipeableDrawer
                    anchor="right"
                    open={drawerState}
                    onClose={() => toggleDrawer(false)}
                    onOpen={() => toggleDrawer(true)}
                >
                    <SidebarPublic />
                </SwipeableDrawer>
            </Box>


        </nav>
    )
}

export default NavbarPublic;