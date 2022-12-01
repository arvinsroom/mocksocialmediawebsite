import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Menu, MenuItem, Modal, Container } from '@material-ui/core';
import RepeatOutlinedIcon from '@material-ui/icons/RepeatOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import InteractionReply from '../../../../../../../../assets/Twitter/interaction-reply.svg';
import InteractionLike from '../../../../../../../../assets/Twitter/interaction-like.svg';
import InteractionRetweet from '../../../../../../../../assets/Twitter/interaction-retweet.svg';
import InteractionShare from '../../../../../../../../assets/Twitter/interaction-share.svg';
import ClearIcon from '@material-ui/icons/Clear';
import TweetBox from '../TweetBox/TweetBox';
import { showSuccessSnackbar } from '../../../../../../../actions/snackbar';
import { 
  likeFbPost,
  unlikeFbPost,
  createFbPost,
  updatePost,
  incrementQuoteRetweetCount,
  decrementQuoteRetweetCount
 } from '../../../../../../../actions/socialMedia';
import { selectPostsMetadata } from '../../../../../../../selectors/socialMedia';
import { USER_TRANSLATIONS_DEFAULT, TW_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';
import "./TwitterPost.css";

const TwitterPostBottom = ({ id }) => {
  const postMetadata = useSelector(state => selectPostsMetadata(state, id));
  const socialMediaTranslations = useSelector(state => state.socialMedia.socialMediaTranslations);
  const { translations } = useSelector(state => state.userAuth);
  const [modalType, setModalType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen , setModalOpen] = useState(false);
  const pageId = useSelector(state => state.socialMedia.pageId);
  const dispatch = useDispatch();

  const [chatBubbleStyle, setChatBubbleStyle] = useState(false)
  const [favIconStyle, setFavIconStyle] = useState(false)
  const [repeatStyle, setRepeatStyle] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openModal = (e, type) => {
    e.preventDefault();
    setModalType(type);
    setModalOpen(!modalOpen);
    // close the menu
    handleClose();
  };

  const handleCloseModal = () => {
    setModalOpen(false)
  };

  const handleRetweet = async (e) => {
    e.preventDefault();

    const postObj = {
      postMessage: null,
      type: 'RETWEET',
      parentPostId: id,
      pageId,
    };
    let formData = new FormData();
    formData.append("file", null);
    formData.append("postObj", JSON.stringify(postObj));
    await dispatch(createFbPost(formData));
    dispatch(incrementQuoteRetweetCount({ _id: id }));
    await dispatch(showSuccessSnackbar(translations?.['posted!'] || USER_TRANSLATIONS_DEFAULT?.POSTED))
    // close the menu
    handleClose();
  };

  const handleUndoRetweet = async (e) => {
    e.preventDefault();
    dispatch(decrementQuoteRetweetCount({ _id: postMetadata.parentPostId }));
    await dispatch(updatePost({ type: 'UNDORETWEET', id }));
  };

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
  };
  
  return (
    // {postMetadata &&
    postMetadata ?
      <div className="twitterPostBottomMain">
      <div className="twitterPostBottomTop"></div>
      <div className="twitterPostFooter">
        <button 
          component="label"
          className="tweetBoxIcons"
          onClick={e => openModal(e, 'REPLY')}
          onMouseOver={() => setChatBubbleStyle(true)}
          onMouseLeave={() => setChatBubbleStyle(false)}>
          <InteractionReply 
            fill="none"
            strokeWidth="1.5"
            stroke={chatBubbleStyle ? '#1d9bf0' : '#536471'}
            className={chatBubbleStyle ? 'twReplyHover tweetBoxAllIcon' : 'tweetBoxAllIcon'}
          />
          &nbsp;
          <span className={chatBubbleStyle ? 'twBlue twitterBottomTextProps' : 'twitterBottomTextProps'}>
            {postMetadata.initReply}
          </span>
        </button>

        <button 
          component="label"
          className="tweetBoxIcons" 
          onClick={handleClick}
          onMouseOver={() => setRepeatStyle(true)}
          onMouseLeave={() => setRepeatStyle(false)}>
         <InteractionRetweet 
            fill="none"
            strokeWidth="1.5"
            stroke={repeatStyle ? '#00ba7c' : '#536471'}
            className={repeatStyle ? 'twRetweetHover tweetBoxAllIcon' : 'tweetBoxAllIcon'}
          />
            &nbsp;
            <span className={repeatStyle ? 'twGreen twitterBottomTextProps' : 'twitterBottomTextProps'} >
              {postMetadata.initTweet}
            </span>
        </button>

        <button 
          component="label" 
          className="tweetBoxIcons" 
          onClick={(e) => handleToggleLike(e)} 
          onMouseOver={() => setFavIconStyle(true)} 
          onMouseLeave={() => setFavIconStyle(false)}>
          <InteractionLike 
            stroke={postMetadata.actionId || favIconStyle ? '#f91880' : '#536471'}
            strokeWidth="1.5"
            fill={postMetadata.actionId ? '#f91880' : 'none'}
            className={favIconStyle ? 'twLikeHover tweetBoxAllIcon' : 'tweetBoxAllIcon'}
          />
          &nbsp;
          <span 
            className={postMetadata.actionId || favIconStyle ? 'twRed twitterBottomTextProps' : 'twitterBottomTextProps'}
            >
              {postMetadata.actionId ? (postMetadata.initLike + 1).toString() : postMetadata.initLike.toString()}
          </span>
        </button>

        <button 
          component="label"
          className="tweetBoxIcons">
          <InteractionShare 
            strokeWidth="1.5"
            fill="none"
            className='tweetBoxAllIcon twButtonIconShare'
          />
        </button>
      </div>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          // keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          { 
          postMetadata.type === "RETWEET" ?
            <MenuItem onClick={e => handleUndoRetweet(e)}>
              <RepeatOutlinedIcon /> {" "} {socialMediaTranslations?.undo_retweet || TW_TRANSLATIONS_DEFAULT.UNDO_RETWEET}
            </MenuItem>
          :
            <MenuItem onClick={e => handleRetweet(e)}>
              <RepeatOutlinedIcon /> {" "} {socialMediaTranslations?.retweet || TW_TRANSLATIONS_DEFAULT.RETWEET}
            </MenuItem>
          }
          <MenuItem onClick={e => openModal(e, 'QUOTETWEET')}>
            <CreateOutlinedIcon /> {" "} {socialMediaTranslations?.quote_tweet || TW_TRANSLATIONS_DEFAULT.QUOTE_TWEET}
          </MenuItem>
        </Menu>
        {modalOpen && 
          <Modal
            open={true}
            disableAutoFocus={true}
            onClose={handleCloseModal}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {
              <Container component="main" className="modalContainer" maxWidth="sm">
              <div className="modalContainerPaper">
                <div className="modalTop">
                  <div className="modalTopBtn">
                    <ClearIcon className="btn" onClick={handleCloseModal} />
                  </div>
                </div>
                {modalType === 'REPLY' ?
                  <div key={modalType}>
                    <TweetBox 
                      placeholderText={socialMediaTranslations?.tweet_your_reply || TW_TRANSLATIONS_DEFAULT.TWEET_YOUR_REPLY}
                      replyTo={id}
                      quoteTweet={null}
                      retweetParentId={postMetadata.type === "RETWEET" ? postMetadata.parentPostId : null}
                      handleCloseModal={handleCloseModal} />
                  </div> :
                  <div key={modalType}>
                    <TweetBox
                      placeholderText={socialMediaTranslations?.add_a_comment || TW_TRANSLATIONS_DEFAULT.ADD_A_COMMENT}
                      replyTo={null}
                      quoteTweet={id}
                      retweetParentId={postMetadata.type === "RETWEET" ? postMetadata.parentPostId : null}
                      handleCloseModal={handleCloseModal} />
                  </div>
                }
              </div>
              </Container>
            }
          </Modal>}
      </div>
      : null
  );
}

export default TwitterPostBottom;