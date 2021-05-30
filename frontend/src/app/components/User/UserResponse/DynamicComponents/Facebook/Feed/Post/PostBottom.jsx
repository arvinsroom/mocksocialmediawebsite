import { useSelector, useDispatch } from "react-redux";
import { likeFbPost, unlikeFbPost, commentFbPost } from '../../../../../../../actions/facebook';
import { selectPostsMetadata } from '../../../../../../../selectors/facebook';
import { useState } from "react";
import { Avatar } from "@material-ui/core";
import { showInfoSnackbar } from '../../../../../../../actions/snackbar';
import ShareModal from './ShareModal';
import shareLogo from '../../../../../../../../../public/assets/icons/share.png';
import commentLogo from '../../../../../../../../../public/assets/icons/comment.png';
import { FB_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';
import React from 'react';
import { FacebookSelector } from '@charkour/react-reactions';
import "./Post.css";

const PostBottom = ({ id }) => {
  const [isShown, setIsShown] = useState(false);
  const postMetadata = useSelector(state => selectPostsMetadata(state, id));
  const fbTranslations = useSelector(state => state.facebook.fbTranslations);
  const userRegisterData = useSelector(state => state.userRegister.metaData);

  const [openCommentBox, setOpenCommentBox] = useState(false);
  const [currentComment, setCurrentComment] = useState("");
  const [modalOpen , setModalOpen] = useState(false);
  const [display, setDisplay] = useState(false);
  const dispatch = useDispatch();

  const handleToggleLike = (e) => {
    e.preventDefault();
    if (postMetadata.actionId) {
      dispatch(unlikeFbPost(postMetadata.actionId, id));
    } else {
      const data = {
        action: 'LIKE',
        comment: null,
        userPostId: id,
      };
      dispatch(likeFbPost(data, id));
    }
    setDisplay(false);
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
  };

  const openModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleReactions = async (reaction) => {
    setDisplay(false);
    // fire the actual action event
    if (postMetadata.actionId) await dispatch(unlikeFbPost(postMetadata.actionId, id));
    const data = {
      action: reaction.toUpperCase(),
      comment: null,
      userPostId: id,
    };
    await dispatch(likeFbPost(data, id));
  }

  return (
    <div
      onMouseLeave={() => setDisplay(false)}>
        <div className="postActionsContainer">
          <div className="postAction reactionContainer childrenReactions">
            {display && <FacebookSelector onSelect={handleReactions} iconSize={30} />}
          </div>
          <div className="postAction totalComments">
            <p>{(postMetadata?.comments?.length.toString() || "0") + " " + (fbTranslations?.comments || FB_TRANSLATIONS_DEFAULT?.COMMENTS)}</p>
          </div>
        </div>
      <div className="postOptions">
        <div className="postOption parentReactions"
          onMouseOver={() => setDisplay(true)}
          onClick={(e) => handleToggleLike(e)}>
            <div className={postMetadata.like.toLowerCase() + 'Emoji'}></div>
            <p className={postMetadata.like.toLowerCase() + 'Text'}>
              {postMetadata.like === 'default' ? fbTranslations?.['LIKE'] || FB_TRANSLATIONS_DEFAULT?.['LIKE'] : 
                fbTranslations?.[postMetadata.like] || FB_TRANSLATIONS_DEFAULT?.[postMetadata.like]}
            </p>
        </div>
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
          <Avatar 
            src={userRegisterData['PROFILEPHOTO'] || ""}
          />
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
            <Avatar 
              src={userRegisterData['PROFILEPHOTO'] || ""}
            />
            <p className="displayIndividualComment">{comment}</p>
          </div>
        )) : null}
      </div>}
      {/* preserve the parent post data */}
      {modalOpen && <ShareModal id={postMetadata.parentPostId || id} setModalOpen={setModalOpen}/>}
      </div>
  );
};

export default PostBottom;