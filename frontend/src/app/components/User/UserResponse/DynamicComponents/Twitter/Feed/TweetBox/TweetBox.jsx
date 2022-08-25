import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Avatar, Input } from '@material-ui/core';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ClearIcon from '@material-ui/icons/Clear';
import PollOutlinedIcon from '@material-ui/icons/PollOutlined';
import SentimentSatisfiedOutlinedIcon from '@material-ui/icons/SentimentSatisfiedOutlined';
import EventOutlinedIcon from '@material-ui/icons/EventOutlined';
import GifIcon from '@material-ui/icons/Gif';
import { USER_TRANSLATIONS_DEFAULT, TW_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';
import { 
  createFbPost,
  incrementRepliesCount,
  incrementQuoteRetweetCount
 } from '../../../../../../../actions/socialMedia';
import { showInfoSnackbar, showSuccessSnackbar } from '../../../../../../../actions/snackbar';
import ReplyToQuoteTweetPreview from '../../../../../../Common/UserCommon/SocialMediaPostType/replyToQuoteTweetPreview';
import "./TweetBox.css";

const TweetBox = ({ placeholderText, replyTo, quoteTweet, handleCloseModal }) => {
  const socialMediaTranslations = useSelector(state => state.socialMedia.socialMediaTranslations);
  const { translations } = useSelector(state => state.userAuth);
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [postMessage, setPostMessage] = useState("");
  const pageId = useSelector(state => state.socialMedia.pageId);
  const [chatBubbleStyle, setChatBubbleStyle] = useState(false)

  const [avatar, setAvatar] = useState(null);
  const [videoAvatar, setVideoAvatar] = useState(null);
  const [type, setType] = useState("TEXT");
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const mediaHandleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      await setFile(selectedFile);
      if (selectedFile.type.includes('video')) {
        await setType('VIDEO');
        await setVideoAvatar(URL.createObjectURL(selectedFile))
      } else {
        await setType('PHOTO');
        await setAvatar(URL.createObjectURL(selectedFile));
      }
    }
    // we already have the selected file, can now clear the state
    e.target.value = null;
  }

  const handleDelete = () => {
    setVideoAvatar(null);
    setAvatar(null);
    setType("TEXT");
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // create formdata for select image or video
    if (!file && !postMessage) {
      dispatch(showSuccessSnackbar(translations?.please_enter_a_valid_response || USER_TRANSLATIONS_DEFAULT.PLEASE_ENTER_A_VALID_RESPONSE));
    } else {
      const totalFileSize = file?.size || 0;
      // less than 20 MB
      if (totalFileSize <= 20e6) {
        // case 1: this is a reply to a post
        const postObj = {
          postMessage: postMessage || null,
          type: type,
          pageId,
        };
        // it is replyTo post
        // set both isReplyTo and parentPostId to UUID of parentPost
        if (replyTo !== null) {
          postObj.parentPostId = replyTo;
          postObj.isReplyTo = replyTo;
        } else if (quoteTweet !== null) {
          postObj.quoteTweetTo = quoteTweet;
        }
        let formData = new FormData();
        formData.append("file", file || null);
        formData.append("postObj", JSON.stringify(postObj));
        await dispatch(createFbPost(formData));
        // update the respective count
        if (replyTo !== null) {
          dispatch(incrementRepliesCount({ _id: replyTo }));
        } else if (quoteTweet !== null) {
          dispatch(incrementQuoteRetweetCount({ _id: quoteTweet }));
        }
        await dispatch(showSuccessSnackbar(translations?.['posted!'] || USER_TRANSLATIONS_DEFAULT?.POSTED));
        // clear the file state
        handleDelete();
        setPostMessage("");
        if (handleCloseModal) handleCloseModal();
      } else {
        dispatch(showInfoSnackbar(translations?.please_upload_file_of_size_less_than_20mb || USER_TRANSLATIONS_DEFAULT?.PLEASE_UPLOAD_FILE_OF_SIZE_LESS_THAN_20MB));
      }
    }
  };

  return (
    <div className="tweetBox">
      {/* replyTo is also similar to share tweet */}
      {replyTo && 
        <div className="sharePostPreview sharePreview">
          <ReplyToQuoteTweetPreview id={replyTo} />
        </div>
      }
      <form>
        <div className="tweetBoxInput">
          <Avatar src={(userRegisterData['PROFILEPHOTO'] || "")} />
          <div className="twitterPostMessage">
            <textarea
              value={postMessage}
              autoFocus={true}
              onChange={({ target }) => setPostMessage(target.value)}
              className="newFeedInputAreaShare"
              type="text"
              placeholder={placeholderText} />
          </div>
        </div>

        {avatar &&
          <div className="container sharePreview sharePostPreview">
            <img src={avatar} alt="upload pic" className="selectedFile" />
            <ClearIcon className="btn" onClick={handleDelete} />
          </div>}
        {videoAvatar &&
          <div className="container sharePreview sharePostPreview">
            <video src={videoAvatar} className="selectedFile" />
            <ClearIcon className="btn" onClick={handleDelete} />
          </div>}

        {/* quotetweet is similar to share tweet */}
        {quoteTweet && 
          <div className="sharePostPreview sharePreview">
            <ReplyToQuoteTweetPreview id={quoteTweet} />
          </div>
        }

        <div className="tweetBoxBottom">
          <div className="newModalOption tweetBoxOtherButton">
            <Button variant="outlined" component="label" className="tweetBoxStyle"  disableRipple onMouseOver={() => setChatBubbleStyle(true)} onMouseLeave={() => setChatBubbleStyle(false)}>
              <PhotoLibraryIcon fontSize="small" className={chatBubbleStyle ? 'tweetBoxAllIcon twChatBubbleHover' : 'twBlue tweetBoxAllIcon'} />
              <input
                type="file"
                hidden
                multiple={false}
                accept="image/*, video/*"
                onChange={(e) => mediaHandleChange(e)}
              />
            </Button>

            <div className="newModalOption">
              <Button variant="outlined" component="label" className="tweetBoxIcons" >
                <GifIcon fontSize="small" className={chatBubbleStyle ? 'tweetBoxAllIcon twChatBubbleHover' : 'twBlue tweetBoxAllIcon'} />
                <input
                  type="file"
                  hidden
                  multiple={false}
                  accept="image/gif"
                  onChange={(e) => mediaHandleChange(e)}
                />
                </Button>
            </div>
            <div className="newModalOption">
              <Button variant="outlined" component="label" className="tweetBoxIcons" >
                <PollOutlinedIcon fontSize="small" className={chatBubbleStyle ? 'tweetBoxAllIcon twChatBubbleHover' : 'twBlue tweetBoxAllIcon'} />
              </Button>
            </div>
            <div className="newModalOption">
              <Button variant="outlined" component="label" className="tweetBoxIcons" >
                <SentimentSatisfiedOutlinedIcon fontSize="small" className={chatBubbleStyle ? 'tweetBoxAllIcon twChatBubbleHover' : 'twBlue tweetBoxAllIcon'} />
              </Button>
            </div>
            <div className="newModalOption">
              <Button variant="outlined" component="label" className="tweetBoxIcons">
                <EventOutlinedIcon fontSize="small" className={chatBubbleStyle ? 'tweetBoxAllIcon twChatBubbleHover' : 'twBlue tweetBoxAllIcon'} />
              </Button>
            </div>
          </div>
          <div className="newModalOption tweetBoxTweetButton">
            <Button
              className="tweetBoxButton"
              onClick={handleSubmit}
            >
              {socialMediaTranslations?.tweet || TW_TRANSLATIONS_DEFAULT.TWEET}
            </Button>
          </div>
      </div>
      </form>
    </div>
  );
}

export default TweetBox;