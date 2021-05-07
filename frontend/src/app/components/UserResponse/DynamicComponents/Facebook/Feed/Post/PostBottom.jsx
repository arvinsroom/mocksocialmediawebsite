import "./Post.css";
import { useSelector, useDispatch } from "react-redux";
import { likeFbPost, unlikeFbPost, commentFbPost } from "../../../../../../actions/facebook";
import { selectPostsMetadata } from '../../../../../../selectors/facebook';
import { useState } from "react";
import { Avatar } from "@material-ui/core";
import { showInfoSnackbar } from "../../../../../../actions/snackbar";
import ShareModal from './ShareModal';
import shareLogo from '../../../../../../../../public/assets/icons/share.png';
import likeLogo from '../../../../../../../../public/assets/icons/like.png';
import commentLogo from '../../../../../../../../public/assets/icons/comment.png';
import { FB_TRANSLATIONS_DEFAULT } from '../../../../../../constants';

const PostBottom = ({ id }) => {
  const postMetadata = useSelector(state => selectPostsMetadata(state, id));
  const fbTranslations = useSelector(state => state.facebookPost.fbTranslations);
  const [openCommentBox, setOpenCommentBox] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [modalOpen , setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const handleLike = (e) => {
    e.preventDefault();
    const data = {
      action: 'LIKE',
      comment: null,
      userPostId: id,
    };
    dispatch(likeFbPost(data, id));
  };

  const handleUnlike = (e) => {
    e.preventDefault();
    dispatch(unlikeFbPost(postMetadata.actionId, id));
  };

  const toggleComment = () => {
    setOpenCommentBox(!openCommentBox);
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (currentComment) {
      const data = {
        action: 'COMMENT',
        comment: currentComment,
        userPostId: id
      };
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
        {!postMetadata.like && <div className="postOption" onClick={e => handleLike(e)}>
          <img src={likeLogo} style={{ color: 'grey', width: '3em', height: '3em', marginRight: '-10px'}} alt="like Logo"/>
          <p style={{color: 'grey', paddingTop: '4px'}}>{fbTranslations?.like || FB_TRANSLATIONS_DEFAULT.LIKE}</p>
        </div>}
        {postMetadata.like && <div className="postOption" onClick={e => handleUnlike(e)}>
          <img src={likeLogo} style={{ color: '#1877F2', width: '3em', height: '3em', marginRight: '-10px'}} alt="like Logo"/>
          <p style={{color: '#1877F2', paddingTop: '4px' }}>{fbTranslations?.like || FB_TRANSLATIONS_DEFAULT.LIKE}</p>
        </div>}
        <div className="postOption" onClick={toggleComment}>
          <img src={commentLogo} style={{ width: '3em', height: '3em', marginRight: '-10px'}} alt="comment Logo"/>
          <p>{fbTranslations?.comment || FB_TRANSLATIONS_DEFAULT.COMMENT}</p>
        </div>
        <div className="postOption" onClick={openModal}>
          <img src={shareLogo} style={{ width: '3em', height: '3em', marginRight: '-10px'}} alt="share Logo"/>
          <p>{fbTranslations?.share || FB_TRANSLATIONS_DEFAULT.SHARE}</p>
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
            placeholder={fbTranslations?.write_a_comment || FB_TRANSLATIONS_DEFAULT.WRITE_A_COMMENT} />

            <button className="postComment" onClick={e => handleSubmitComment(e)} type="submit">
              {fbTranslations?.post || FB_TRANSLATIONS_DEFAULT.POST}
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
      {/* preserve the parent post data */}
      {modalOpen && <ShareModal id={postMetadata.parentPostId || id} setModalOpen={setModalOpen}/>}
  </>
  );
};

export default PostBottom;