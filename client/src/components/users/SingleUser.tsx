import { useContext, useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import Typography from '@mui/material/Typography';
import { API } from '../../common/constants'
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { Avatar, Chip, IconButton } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import scrollToTop from '../../common/scrollToTop';
import { acceptFriend, addFriend, deleteFriend, getUser, getUserPosts } from '../../services/requests';
import calcPostRating from '../../common/calcPostRating';
import { Post, User } from '../../types/types';

type SingleUserProps = {
  handleDeleteUser: (id: number) => void
} & User

const SingleUser = ({ id, username, avatar, friends, latitude, handleDeleteUser }: SingleUserProps) => {
  const { loginStatus, user, setUser } = useContext(AuthContext);
  const [rating, setRating] = useState(0);
  const [friendsState, setFriendsState] = useState(friends || []);


  useEffect(() => {
    (async () => {
      const result: Post[] = await getUserPosts(id);
      if (result && result.length > 0) {
        setRating(result.reduce((state, p) => {
          return (state += calcPostRating(p.likes))
        }, 0));
      }
    })();
    return () => { }
  }, [rating, setRating, id, loginStatus, user, setFriendsState]);

  const friend = friendsState?.find(u => u.id === user.id);
  const removeButton = friend?.friendshipStatus === 2
    ? <Button size="medium" onClick={() => handleRemoveFriend(id)} startIcon={<PersonOffIcon />}>Изтрий</Button>
    : ''

  const addButton =
    !friend?.friendshipStatus
      ? <Button size="medium" onClick={() => handleAddFriend(id)} startIcon={<PersonAddIcon />} >Добави</Button>
      : '';

  const pendingMsg =
    (friend?.friendshipStatus === 1 && friend.canAcceptFriendship)
      ? <Button
        disableRipple
        disableFocusRipple
        startIcon={<HourglassEmptyIcon />}
      >Висящо
      </Button>
      : ''

  const acceptFriendButton =
    (friend?.friendshipStatus === 1 && !friend.canAcceptFriendship)
      ? <Button size="medium" startIcon={<CheckBoxIcon />} onClick={() => handleAcceptFriend(id)} >Приеми</Button>
      : ''

  const handleAddFriend = async (id: number) => {
    await addFriend(id);
    const updatedFriends = [...friendsState];
    const isFriend = updatedFriends.find(fr => fr.id === user.id);
    if (isFriend) {
      const indexOfFriend = updatedFriends.indexOf(isFriend);
      updatedFriends[indexOfFriend].friendshipStatus = 1
      updatedFriends[indexOfFriend].canAcceptFriendship = true
    } else {
      updatedFriends.push({
        id: user.id,
        friendshipStatus: 1,
        canAcceptFriendship: true,
        avatar: user.avatar,
        username: user.username,
      })
    }
    setFriendsState(updatedFriends);
  }

  const handleRemoveFriend = async (id: number) => {
    await deleteFriend(id);
    const updatedFriends = [...friendsState];
    updatedFriends.forEach(fr => {
      if (fr.id === user.id) fr.friendshipStatus = 0
    });
    setFriendsState(updatedFriends);
  }

  const handleAcceptFriend = async (id: number) => {
    await acceptFriend(id);
    const updatedFriends = [...friendsState];
    updatedFriends.forEach(fr => {
      if (fr.id === user.id) fr.friendshipStatus = 2
    });
    setFriendsState(updatedFriends);
    setUser(await getUser())
  }


  const ratingColor = (rating: number) => {
    if (rating < 0) {
      return 'error'
    } else if (rating === 0) {
      return 'warning'
    } else {
      return 'success'
    }
  }
  return (
    <Card sx={{
      maxWidth: 345,
      '& .MuiCardMedia-img': { transition: 'all 0.2s ease-in-out' },
      '&:hover .MuiCardMedia-img': {
        transform: 'scale(1.1)'
      }
    }}>
      <CardMedia
        component="img"
        alt="Profile avatar"
        height="200"
        image={`${API}/${avatar}`}
      />
      <CardContent>
        <Typography gutterBottom variant="subtitle1" component="div">
          <div style={{ minHeight: '4rem' }}>{username}</div>
          <div style={
            {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '0',
              minHeight: '2rem'
            }}>
            {
              (loginStatus && !latitude) &&
              <Chip
                color={ratingColor(rating)}
                avatar={<Avatar>{rating}</Avatar>}
                label="Рейтинг"
              />
            }
            {
              user.role === 2 && loginStatus &&
              <IconButton aria-label="delete" onClick={() => handleDeleteUser(id)}>
                <DeleteIcon />
              </IconButton>
            }
          </div>
        </Typography>
      </CardContent>
      <CardActions>
        {loginStatus ? removeButton : ''}
        {loginStatus ? addButton : ''}
        {loginStatus ? acceptFriendButton : ''}
        {loginStatus ? pendingMsg : ''}
        {loginStatus ?
          <Link
            to={`/users/profile/${id}`}
            style={{ textDecoration: 'none' }}
            onClick={() => scrollToTop()}>
            <Button size="medium" startIcon={<AccountBoxIcon />}>Досие</Button>
          </Link> : ''}

      </CardActions>
    </Card>
  );

}
export default SingleUser;






