import calcTimeOffset from "../../common/calcTimeOffset";
import { API } from "../../common/constants"
import YouTube from "../embed/YouTube";
import "./SingleFeedPopular.css";
import { Post } from '../../types/types';

const SingleFeedPopular = ({ content, picture, createdOn, likesCount, embed }: Post) => {

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <span className="postDate">{calcTimeOffset(createdOn)}</span>
        </div>
        <div className="postCenter">
          <p className="postText">{content}</p>
          {
            picture &&
            <img className="postImg"
              src={`${API}/${picture}`}
              alt={picture}
            />
          }
          {embed && <YouTube url={embed} />}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <span className="postLikeCounter">{likesCount > 0 ? `${likesCount} потребители харесват този пост` : ''}</span>
          </div>
          <div className="postBottomRight">
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleFeedPopular;