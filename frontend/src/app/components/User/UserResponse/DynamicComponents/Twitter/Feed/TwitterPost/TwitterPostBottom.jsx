import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Button, Menu, MenuItem, Modal, Container } from '@material-ui/core';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatOutlinedIcon from '@material-ui/icons/RepeatOutlined';
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteBorder from "@material-ui/icons/Favorite";
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
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

  //icons style state

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
    setRepeatStyle(true);
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
      <>
      <div className="twitterPostFooter addMarginInMobile">
        <Button variant="outlined" component="label" className="tweetBoxIcons" disableRipple onClick={e => openModal(e, 'REPLY')} onMouseOver={() => setChatBubbleStyle(true)} onMouseLeave={() => setChatBubbleStyle(false)}>
          <ChatBubbleOutlineIcon fontSize="small" className={chatBubbleStyle ? 'tweetBoxAllIcon twChatBubbleHover' : 'tweetBoxAllIcon'} />
          &nbsp; <span className={chatBubbleStyle ? 'twBlue commentCountText' : 'commentCountText'}>{postMetadata.initReply}</span>
        </Button>

        <Button variant="outlined" component="label" className="tweetBoxIcons" onClick={handleClick} disableRipple>
          <RepeatOutlinedIcon fontSize="small" className='tweetBoxAllIcon twRetweetIcon' style={{ color: repeatStyle ? '#5eaa7b' : '' }} />
          &nbsp; <span className={chatBubbleStyle ? 'twBlue commentCountText' : 'commentCountText'}>{postMetadata.initTweet}</span>
        </Button>

        <Button variant="outlined" component="label" disableRipple className="tweetBoxIcons" onClick={(e) => handleToggleLike(e)} onMouseOver={() => setFavIconStyle(true)} onMouseLeave={() => setFavIconStyle(false)}>
          {
            postMetadata.actionId ?
              <FavoriteBorder fontSize="small" className='tweetBoxAllIcon twRed' /> :
              <FavoriteBorderIcon fontSize="small" className={favIconStyle ? 'tweetBoxFavIconHover tweetBoxAllIcon' : 'tweetBoxAllIcon'} />
          }
          &nbsp; <span className={favIconStyle ? 'twRed countText' : 'countText'} style={postMetadata.actionId && { color: '#F91880' }}>{postMetadata.actionId ? (postMetadata.initLike + 1).toString() : postMetadata.initLike.toString()}</span>
        </Button>

        <Button variant="outlined" component="label" className="tweetBoxIcons">
          <PublishOutlinedIcon fontSize="small" />
        </Button>
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
            <RepeatOutlinedIcon /> {" "} {"Undo Retweet"}
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
      </>
      : null
  );
}

export default TwitterPostBottom;