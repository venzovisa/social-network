import { useContext,useState } from "react"
import { API } from "../../common/constants"
import { AuthContext } from "../../context/AuthContext"
import CreateComment from "../comments/CreateComment";
import PostComments from "../comments/PostComments";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from "@mui/system";
import { deleteComment, deletePost, getUserPosts, postsReactions } from "../../services/requests";
import { Badge, Collapse, Fade, Modal } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import UpdatePost from "./UpdatePost";
import reactions from '../../reactions/reactions.js';
import { AppContext } from "../../context/AppContext";
import YouTube from "../embed/YouTube";
import calcTimeOffset from "../../common/calcTimeOffset";
import scrollToTop from "../../common/scrollToTop";
import { Link } from "react-router-dom";


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

const SinglePost = ({ id, content, picture, author, createdOn, comments, likes, embed}) => {
    const {user} = useContext(AuthContext);
    const {setPosts} = useContext(AppContext);
    const [commentForm, setCommentForm] = useState(false);
    const [anchorEl, setAnchorEl] = useState(false);
    const [openUpdate, setOpenUpdate] = useState(false);
    const [reactionsList, setReactionsList] = useState(false);
    const [reactionStats, setReactionStats] = useState(false);
    
    const handleUpdateOpen = () => {
      setAnchorEl(false);
      setOpenUpdate(true);
    };

    const handleUpdateClose = () => setOpenUpdate(false);

    const handleClick = () => {
      setAnchorEl(!anchorEl);
    };
    const handleClose = () => {
      setAnchorEl(false);
    };

    const handleLike = async(id, reaction) =>{
      if (await postsReactions(id, reaction)) {
        setPosts(await getUserPosts(user.id));
      } else {
        alert('Нещо се обърка');
      }
    }

    const handleUpdatePost = async (id) =>{
      const result = await getUserPosts(user.id);
      if (result) {
        setPosts(result);
      } else {
        alert('Нещо се обърка');
      }
    }

    const handleDeletePost = async () => {
      if (await deletePost(id)) {
        setPosts(await getUserPosts(user.id));
      } else {
        alert('Нещо се обърка');
      }

      setAnchorEl(false);
    }

    const handleDeleteComment = async (id) => {
      if (await deleteComment(id)) {
        setPosts(await getUserPosts(user.id));
      } else {
        alert('Нещо се обърка');
      }
    }
      
    const renderReactions = reactionsList && 
    <div onMouseLeave={() => setReactionsList(!reactionsList)} >      
      {
        Object.values(reactions).map((value, index) => 
          <img
            key={index}
            className="likeIcon" 
            src={value}
            onClick={() => handleLike(id, index + 1)} 
            alt="Like" 
          /> )
      }
    </div>;

    const renderPeopleLikes = likes.length === 0 
    ?  '' 
    :  <span 
        onClick={() => {setReactionStats(!reactionStats)}} 
        className="postLikeCounter"
      >
        {likes.length} потребители харесват публикацията
      </span>;

    const renderReactionStats = reactionStats ? <div style={{marginTop:'1rem'}}>
      {
        Object.values(reactions).map((value, index) => 
        likes.filter(r => r.reaction === index + 1).length === 0 
        ?  '' 
        : <Badge 
            key={index}
            sx={{marginRight:"0.75rem"}} 
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom'}} 
            color="error" 
            badgeContent={likes.filter(r => r.reaction === index + 1).length}>
          <img 
              className="likeIcon" 
              src={value} 
              alt="Like" 
          /> </Badge>
        )
      }
    </div>: '';

    const renderComments = 
      <div>
       {!user.latitude && <CreateComment id={id}/>}
        <PostComments 
          comments={comments} 
          postId={id} 
          handleDeleteComment={handleDeleteComment} 
        />
      </div>;
    
    return (
      <>
        <div className="post" onMouseLeave={() => handleClose()}>
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
            <img
              className="postProfileImg"
              src={`${API}/${author.avatar}`}
              alt="postProfileImg"
            /> 
              <span className="postUsername">
                <Link 
                  className="postLinkProfile" 
                  to={`/users/profile/${author.id}`} 
                  onClick={() => scrollToTop()}
                >
                    {author.username}
                </Link>
              </span>
              <span className="postDate">{calcTimeOffset(createdOn)}</span>
            </div>
            {(user.id === author.id || user.role === 2) && <div className="postTopRight">
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreVertIcon />
              </IconButton>
              <Box
                className={anchorEl ? "menu-root menu-open" : "menu-root menu-close"}       
                onClose={handleClose}
              >
                <p className="menu-item" onClick={handleUpdateOpen}>
                  Редактиране
                </p>
                <p className="menu-item" onClick={handleDeletePost}>
                  Изтриване
                </p>
            </Box>
            </div>}
          </div>
          <div className="postCenter">
            <p className="postText">{content}</p>
            { picture && 
              <img 
                className="postImg" 
                src={`${API}/${picture}`} 
                alt={author.username} 
              /> 
            }
            { embed && <YouTube url={embed} /> }
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              {renderReactions}
              {(!reactionsList && user.latitude===1) && <>
                <img 
                  className="likeIcon" 
                  src={reactions.like}
                  alt="Like" 
                  onMouseOver={() => setReactionsList(!reactionsList)} 
                />
            </>}
              {!reactionsList &&  renderPeopleLikes}
            </div>
            <div className="postBottomRight">
              <span 
                className="postCommentText" 
                onClick={ () => setCommentForm(!commentForm) }
              >{comments.length} коментара</span>
            </div>
          </div>
             {renderReactionStats}
        </div>
        <Collapse sx={{ m: 1 }} in={commentForm} timeout={{ appear: 1000, enter: 1000, exit: 500 }}>
          {renderComments}
        </Collapse>
      </div>

      <Modal
        aria-labelledby="update-post-modal-title"
        aria-describedby="update-post-modal-description"
        open={openUpdate}
        onClose={handleUpdateClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
        timeout: 500,
        }}
      >
        <Fade in={openUpdate}>
        <Box sx={style}>
            <UpdatePost 
              handleCloseModal={handleUpdateClose} 
              handleUpdatePost={handleUpdatePost}
              id={id} 
              content={content}
              setPosts={setPosts} />
        </Box>
        </Fade>
      </Modal>

      </>
    )
}

export default SinglePost;