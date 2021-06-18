import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { Button, Menu, MenuItem, Modal, Container } from '@material-ui/core';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import RepeatOutlinedIcon from '@material-ui/icons/RepeatOutlined';
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import PublishOutlinedIcon from '@material-ui/icons/PublishOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import ClearIcon from '@material-ui/icons/Clear';
import TweetBox from './TweetBox';
import { showInfoSnackbar, showSuccessSnackbar } from '../../../../../../actions/snackbar';
import { likeFbPost, unlikeFbPost, createFbPost } from '../../../../../../actions/socialMedia';
import { selectPostsMetadata } from '../../../../../../selectors/socialMedia';
import { USER_TRANSLATIONS_DEFAULT } from '../../../../../../constants';
import "./TwitterPost.css";

const TwitterPostBottom = ({ id }) => {
  const postMetadata = useSelector(state => selectPostsMetadata(state, id));
  const { translations } = useSelector(state => state.userAuth);
  const [modalType, setModalType] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [modalOpen , setModalOpen] = useState(false);
  const pageId = useSelector(state => state.socialMedia.pageId);
  const dispatch = useDispatch();

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
    } 
    let formData = new FormData();
    formData.append("file", null);
    formData.append("postObj", JSON.stringify(postObj));
    await dispatch(createFbPost(formData));
    await dispatch(showSuccessSnackbar(translations?.['posted!'] || USER_TRANSLATIONS_DEFAULT?.POSTED))
    // close the menu
    handleClose();
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
    <>
      <div className="twitterPostFooter addMarginInMobile">
        <Button variant="outlined" component="label" className="tweetBoxIcons">
          <ChatBubbleOutlineIcon fontSize="small" onClick={e => openModal(e, 'REPLY')} />
        </Button>

        <Button variant="outlined" component="label" className="tweetBoxIcons" onClick={handleClick}>
          <RepeatOutlinedIcon fontSize="small" />
        </Button>

        <Button variant="outlined" component="label" className="tweetBoxIcons" onClick={(e) => handleToggleLike(e)}>
          <FavoriteBorderIcon fontSize="small" /> &nbsp; {postMetadata.actionId ? (postMetadata.initLike + 1).toString() : postMetadata.initLike.toString()}
        </Button>

        <Button variant="outlined" component="label" className="tweetBoxIcons">
          <PublishOutlinedIcon fontSize="small" />
        </Button>
      </div>

      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={e => handleRetweet(e)}>
          <RepeatOutlinedIcon /> {" "} Retweet
        </MenuItem>
        <MenuItem onClick={e => openModal(e, 'QUOTETWEET')}>
          <CreateOutlinedIcon /> {" "} Quote Tweet
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
                <div key={modalType}><TweetBox placeholderText={"Tweet your reply"} replyTo={id} quoteTweet={null} handleCloseModal={handleCloseModal} /></div> :
                <div key={modalType}><TweetBox placeholderText={"Add a comment"} replyTo={null} quoteTweet={id} handleCloseModal={handleCloseModal} /></div>
              }
            </div>
            </Container>
          }
        </Modal>}
    </>
  );
}

export default TwitterPostBottom;