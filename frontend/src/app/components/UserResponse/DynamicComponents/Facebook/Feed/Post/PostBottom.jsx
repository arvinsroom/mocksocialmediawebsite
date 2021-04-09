import "./Post.css";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import NearMeIcon from '@material-ui/icons/NearMe';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useSelector, useDispatch } from "react-redux";
import { likeFbPost, unlikeFbPost, commentFbPost } from "../../../../../../actions/facebook";
import { selectAllLikes } from '../../../../../../reducers/facebook';
import { useState } from "react";
import { Avatar } from "@material-ui/core";
import { showInfoSnackbar } from "../../../../../../actions/snackbar";
import ShareModal from './ShareModal';

const PostBottom = ({ id }) => {
  const postMetadata = useSelector(state => selectAllLikes(state, id));
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [modalOpen , setModalOpen] = useState(false);

  // const singlePost = useSelector(state => selectSubItems(state, id));

  const dispatch = useDispatch();
  // adminPostId, action, userPostId, comment
  const handleLike = () => {
    console.log('handle-Like');
    const data = {
      action: 'LIKE',
      comment: null,
      adminPostId: postMetadata.isAdmin ? id : null,
      userPostId: postMetadata.isAdmin ? null : id
    };
    dispatch(likeFbPost(data, id));
  };

  const handleUnlike = () => {
    console.log('handle-Unlike');
    dispatch(unlikeFbPost(postMetadata.actionId, id));
  };

  const toggleComment = () => {
    setOpenCommentBox(!openCommentBox);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    const data = {
      action: 'COMMENT',
      comment: currentComment,
      adminPostId: postMetadata.isAdmin ? id : null,
      userPostId: postMetadata.isAdmin ? null : id
    };
    if (currentComment) {
      dispatch(commentFbPost(data, id));
      setCurrentComment("");
    }
    else dispatch(showInfoSnackbar("Please type in a comment!"))
  };

  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
  <>
      <div className="postOptions">
        {console.log('inside postBottom')}

        {!postMetadata.like && <div className="postOption" onClick={handleLike}>
          <ThumbUpIcon style={{color: 'grey'}} />
          <p style={{color: 'grey'}}>Like</p>
        </div>}
        {postMetadata.like && <div className="postOption" onClick={handleUnlike}>
          <ThumbUpIcon style={{color: '#1877F2' }} />
          <p style={{color: '#1877F2' }}>Like</p>
        </div>}
        <div className="postOption" onClick={toggleComment}>
          <ChatBubbleOutlineIcon />
          <p>Comment</p>
        </div>
        <div className="postOption" onClick={openModal}>
          <NearMeIcon />
          <p>Share</p>
        </div>
        <div className="postOption" >
          <AccountCircleIcon />
          <ExpandMoreIcon />
        </div>
    </div>
    {openCommentBox && 
      <div className="comment">
        <div className="createComment">
          <Avatar />
          <form>
            <input
            value={currentComment}
            onChange={({ target }) => setCurrentComment(target.value)}
            className="createCommentInputText"
            type="text"
            placeholder="Write a comment..." />

            <button className="postComment" onClick={e => handleSubmitComment(e)} type="submit">
              Post
            </button>
          </form>
        </div>

        {postMetadata.comments?.length > 0 ? postMetadata.comments.map((comment, idx) => (
          <div key={idx} className="showComment">
            <Avatar />
            <p className="displayIndividualComment">{comment}</p>
          </div>
        )) : null}
      </div>}
      {modalOpen && <ShareModal id={id} isAdmin={postMetadata.isAdmin} setModalOpen={setModalOpen}/>}
  </>
  );
};

export default PostBottom;