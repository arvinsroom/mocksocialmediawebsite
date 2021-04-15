import "./Post.css";
import ThumbUpOutlinedIcon from '@material-ui/icons/ThumbUpOutlined';
// import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
// import NearMeIcon from '@material-ui/icons/NearMe';
import { useSelector, useDispatch } from "react-redux";
import { likeFbPost, unlikeFbPost, commentFbPost } from "../../../../../../actions/facebook";
import { selectAllLikes } from '../../../../../../reducers/facebook';
import { useState } from "react";
import { Avatar } from "@material-ui/core";
import { showInfoSnackbar } from "../../../../../../actions/snackbar";
import ShareModal from './ShareModal';
import shareLogo from'../../../../../../../../public/assets/icons/share.png';
import likeLogo from'../../../../../../../../public/assets/icons/like.png';
import commentLogo from'../../../../../../../../public/assets/icons/comment.png';


const PostBottom = ({ id }) => {
  const postMetadata = useSelector(state => selectAllLikes(state, id));
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [modalOpen , setModalOpen] = useState(false);

  // const singlePost = useSelector(state => selectSubItems(state, id));

  const dispatch = useDispatch();
  // adminPostId, action, userPostId, comment
  const handleLike = () => {
    const data = {
      action: 'LIKE',
      comment: null,
      adminPostId: postMetadata.isAdmin ? id : null,
      userPostId: postMetadata.isAdmin ? null : id
    };
    dispatch(likeFbPost(data, id));
  };

  const handleUnlike = () => {
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

        {!postMetadata.like && <div className="postOption" onClick={handleLike}>
          {/* <ThumbUpOutlinedIcon style={{color: 'grey'}} /> */}
          <img src={likeLogo} style={{ width: '3em', height: '3em', marginRight: '-10px'}} alt="like Logo"/>
          <p style={{color: 'grey', paddingTop: '4px'}}>Like</p>
        </div>}
        {postMetadata.like && <div className="postOption" onClick={handleUnlike}>
          {/* <ThumbUpOutlinedIcon style={{color: '#1877F2' }} /> */}
          <img src={likeLogo} style={{ width: '3em', height: '3em', marginRight: '-10px'}} alt="like Logo"/>
          <p style={{color: '#1877F2', paddingTop: '4px' }}>Like</p>
        </div>}
        <div className="postOption" onClick={toggleComment}>
          {/* <ChatBubbleOutlineIcon /> */}
          <img src={commentLogo} style={{ width: '3em', height: '3em', marginRight: '-10px'}} alt="comment Logo"/>
          <p>Comment</p>
        </div>
        <div className="postOption" onClick={openModal}>
          <img src={shareLogo} style={{ width: '3em', height: '3em', marginRight: '-10px'}} alt="share Logo"/>
          <p>Share</p>
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