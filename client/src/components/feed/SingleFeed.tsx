import { useContext, useState } from "react"
import { API } from "../../common/constants"
import { AuthContext } from "../../context/AuthContext"
import CreateComment from "../comments/CreateComment";
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box } from "@mui/system";
import { Collapse, Fade, Modal } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import reactions from '../../reactions/reactions.js';
import { AppContext } from "../../context/AppContext";
import UpdatePost from "../posts/UpdatePost.jsx";
import calcTimeOffset from "../../common/calcTimeOffset";
import { Author } from "../../types/types";
import { usePostsReactionsMutation, useDeletePostMutation } from "../../api/apiSlice";

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

type SingleFeedProps = {
  id: number;
  content: string;
  picture: string;
  author: Author;
  createdOn: string;
  comments: string[];
  likes: number[];
}

const SingleFeed = ({ id, content, picture, author, createdOn, comments, likes }: SingleFeedProps) => {
  const { user } = useContext(AuthContext);
  const [commentForm, setCommentForm] = useState(false);
  const [anchorEl, setAnchorEl] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [postsReactions] = usePostsReactionsMutation();
  const [deletePost] = useDeletePostMutation();
  const handleUpdateOpen = () => {
    setAnchorEl(false);
    setOpenUpdate(true);
  };
  const handleUpdateClose = () => setOpenUpdate(false);
  const { setPosts } = useContext(AppContext);


  const handleClick = () => {
    setAnchorEl(!anchorEl);
  };

  const handleLike = async (id: number, reaction: number) => {
    // if (await postsReactions({id, reaction})) {
    //   setPosts(await getFeed());
    // } else {
    //   alert('Something went wrong');
    // }
    try {
      await postsReactions({ id, reaction });
    } catch (error) {
      console.error(error);
      alert('Something went wrong while post reaction');
    }
  }

  const handleDelete = async () => {
    // if (await deletePost({ id })) {
    //   setPosts(await getFeed());
    // } else {
    //   alert('Something went wrong');
    // }

    try {
      await deletePost({ id });
    } catch (error) {
      console.error(error);
      alert('Something went wrong while delete post');
    }

    setAnchorEl(false);
  }

  const renderComments = <div>
    <CreateComment id={id} />
    {/* <PostComments comments={comments} /> */}
  </div>

  return (
    <>
      <div className="post">
        <div className="postWrapper">
          <div className="postTop">
            <div className="postTopLeft">
              {
                author?.avatar &&
                <img
                  className="postProfileImg"
                  src={`${API}/${author.avatar}`}
                  alt="postProfileImg"
                />
              }
              <span className="postUsername">
                {author.username}
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
              >
                <p className="menu-item" onClick={() => handleUpdateOpen()}>
                  Edit
                </p>
                <p className="menu-item" onClick={() => handleDelete()}>
                  Delete
                </p>
              </Box>
            </div>}
          </div>
          <div className="postCenter">
            <p className="postText">{content}</p>
            {picture && <img className="postImg"
              src={`${API}/${picture}`} alt={author.username} />}
          </div>
          <div className="postBottom">
            <div className="postBottomLeft">
              <img
                className="likeIcon"
                src={reactions.like}
                onClick={() => handleLike(id, 1)}
                alt="Like"
              />
              <img
                className="likeIcon"
                src={reactions.love}
                onClick={() => handleLike(id, 2)}
                alt="Love"
              />
              <img
                className="likeIcon"
                src={reactions.care}
                onClick={() => handleLike(id, 3)}
                alt="Care"
              />
              <img
                className="likeIcon"
                src={reactions.laught}
                onClick={() => handleLike(id, 4)}
                alt="Laught"
              />
              <img
                className="likeIcon"
                src={reactions.lol}
                onClick={() => handleLike(id, 5)}
                alt="LOL"
              />
              <img
                className="likeIcon"
                src={reactions.sad}
                onClick={() => handleLike(id, 6)}
                alt="Sad"
              />
              <img
                className="likeIcon"
                src={reactions.angry}
                onClick={() => handleLike(id, 7)}
                alt="Angry"
              />
              <span className="postLikeCounter">{likes.length} people like it</span>
            </div>
            <div className="postBottomRight">
              <span className="postCommentText" onClick={() => setCommentForm(!commentForm)}>{comments.length} comments</span>
            </div>
          </div>
        </div>
        <Collapse sx={{ m: 1 }} in={commentForm} timeout={{ appear: 1000, enter: 1000, exit: 500 }}>
          {renderComments}
        </Collapse>
      </div>

      <Modal
        aria-labelledby="register-modal-title"
        aria-describedby="register-modal-description"
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
              id={id}
              content={content}
              handleUpdatePost={setPosts}
            />
          </Box>
        </Fade>
      </Modal>

    </>
  )
}

export default SingleFeed;