import { API } from "../../common/constants"
import "./SinglePostComment.css";
//import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Backdrop, Fade, IconButton, Modal } from "@mui/material";
import UpdateComment from "./UpdateComment";
import { Box } from "@mui/system";
import { useState } from "react";
import calcTimeOffset from "../../common/calcTimeOffset";
import { Link } from "react-router-dom";
//import { deleteComment } from "../../services/requests";

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

const SingleUserComment = ({ id, author, content, createdOn, picture, likes, i }) => {
  const [openUpdate, setOpenUpdate] = useState(false);
  //const [commentContent, setCommentContent] = useState(content);

  const handleUpdateOpen = () => {
    setOpenUpdate(true);
  };

  const handleUpdateClose = () => setOpenUpdate(false);

  // const handleDeleteComment = async (id) => {
  //   if (await deleteComment(id)) {
  //       setCommentContent(commentContent.filter(c => c.id !== id));
  //   } else {
  //     alert('Нещо се обърка');
  //   }
  // }

  const likeHandler = () => {
    console.log('like')
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
              <Link className="postLinkProfile" to={`/users/profile/${author.id}`}>{author.username}</Link>
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
            <img className="likeIcon" src="https://iconape.com/wp-content/png_logo_vector/facebook-reaction-like.png" onClick={likeHandler} alt="" />
            <img className="likeIcon" src="https://www.freeiconspng.com/thumbs/facebook-love-png/facebook-love-png-3.png" onClick={likeHandler} alt="" />
            <span className="commentLikeCounter">{likes.length} потребители харесват този коментар</span>
          </div>
          <div className="postBottomRight">
            <IconButton aria-label="edit" onClick={() => handleUpdateOpen(id)}>
              <EditIcon />
            </IconButton>
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

export default SingleUserComment;

