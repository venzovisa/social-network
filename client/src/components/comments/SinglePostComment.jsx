import { API } from "../../common/constants"
import "./SinglePostComment.css";
//import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Backdrop, Fade, IconButton, Modal } from "@mui/material";
import UpdateComment from "./UpdateComment";
import { Box } from "@mui/system";
import { useContext, useState } from "react";
import calcTimeOffset from "../../common/calcTimeOffset";
import { Link } from "react-router-dom";
import { commentReactions, getSinglePost } from "../../services/requests";
import scrollToTop from "../../common/scrollToTop";
import { AuthContext } from "../../context/AuthContext";

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

const SinglePostComment = ({ id, author, content, createdOn, picture, likes, i, handleDeleteComment, setComms, postId }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  const { user } = useContext(AuthContext);

  const handleUpdateOpen = () => {
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => setOpenUpdate(false);

  const likeHandler = async () => {
    if (await commentReactions(id, 1)) {
      setComms((await getSinglePost(postId)).comments);
    } else {
      alert('Нещо се обърка');
    }
  }

  const dislikeHandler = async () => {
    if (await commentReactions(id, 2)) {
      setComms((await getSinglePost(postId)).comments);
    } else {
      alert('Нещо се обърка');
    }
  }

  return (
    <div className="comment">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <img
              className="postCommentImg"
              src={`${API}/${author.avatar}`}
              alt="postProfileImg"
            />
            <span style={{ marginLeft: '1em' }}>#{i + 1}</span>
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
          <div className="postTopRight">
          </div>
        </div>
        <div className="commentCenter">
          <span className="commentText">{content}</span>
          {picture && <img className="postImg"
            src={`${API}/${picture}`} alt={author.username} />}
        </div>

        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className="likeIcon"
              src={`data:image/png;base64,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`}
              onClick={likeHandler}
              alt="Like" />
            <span className="commentLikeCounter">{likes.filter(r => r.reaction === 1).length} </span>
            <img
              className="likeIcon"
              style={{ height: "22px", width: "22px", marginLeft: "1rem" }}
              src={`data:image/png;base64,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`}
              onClick={dislikeHandler} alt="Dislike" />
            <span className="commentLikeCounter">{likes.filter(r => r.reaction === 2).length}</span>
          </div>
          <div className="postBottomRight">
            {(user.role === 2 || user.id === author.id) && <IconButton aria-label="edit" onClick={() => handleUpdateOpen(id)}>
              <EditIcon />
            </IconButton>}
            {/* <IconButton aria-label="delete" onClick={() => handleDeleteComment(id)}>
                <DeleteIcon />
              </IconButton> */}
          </div>
        </div>
      </div>

      <Modal
        aria-labelledby="comment-modal-title"
        aria-describedby="comment-modal-description"
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
            <UpdateComment
              handleCloseModal={handleUpdateClose}
              id={id}
              content={content} />
          </Box>
        </Fade>
      </Modal>
    </div>
  )
}

export default SinglePostComment;

