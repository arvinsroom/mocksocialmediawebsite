import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Button, Avatar, IconButton } from '@material-ui/core';
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

const TweetBox = ({ placeholderText, replyTo, quoteTweet, retweetParentId, handleCloseModal }) => {
  const socialMediaTranslations = useSelector(state => state.socialMedia.socialMediaTranslations);
  const { translations } = useSelector(state => state.userAuth);
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [postMessage, setPostMessage] = useState("");
  const pageId = useSelector(state => state.socialMedia.pageId);
  const [count, setCount] = useState(0);
  const [dynamicHeight, setDynamicHeight] = useState("20px");

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
    }
    else if (count > 280) {
      dispatch(showInfoSnackbar("Please limit characters to 280"));
    }
    else {
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
          if (retweetParentId !== null) {
            postObj.parentPostId = retweetParentId;
            postObj.isReplyTo = retweetParentId;  
          } else {
            postObj.parentPostId = replyTo;
            postObj.isReplyTo = replyTo;
          }
        } else if (quoteTweet !== null) {
          if (retweetParentId !== null) {
            postObj.quoteTweetTo = retweetParentId;
          } else {
            postObj.quoteTweetTo = quoteTweet;
          }
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
        setCount(0);
        if (handleCloseModal) handleCloseModal();
      } else {
        dispatch(showInfoSnackbar(translations?.please_upload_file_of_size_less_than_20mb || USER_TRANSLATIONS_DEFAULT?.PLEASE_UPLOAD_FILE_OF_SIZE_LESS_THAN_20MB));
      }
    }
  };

  const updateTextAreaState = (value) => {
    // update height
    let valueLength = value ? value.length : 0;
    let numberOfLineBreaks = (value.match(/\n/g) || []).length;
    // min-height + lines x line-height + padding + border
    let newLineHeight = 35 + numberOfLineBreaks * 35;
    let newValueLengthHeight = 35 + Math.ceil(valueLength / 40) * 35;
    console.log('newLineHeight: ', newLineHeight);
    console.log('newValueLengthHeight: ', newValueLengthHeight);

    let newHeight = Math.max(newLineHeight, newValueLengthHeight);
    setDynamicHeight(newHeight.toString() + "px");
    console.log(dynamicHeight)

    if (valueLength > 280) {
      dispatch(showInfoSnackbar("Please limit characters to 280"));         
    }
    setPostMessage(value);
    setCount(valueLength);
  }

  return (
    <div className="tweetBox">
      {/* replyTo is also similar to share tweet */}
      {replyTo ?
        retweetParentId ?
        <div className="sharePostPreview sharePreview">
          <ReplyToQuoteTweetPreview id={retweetParentId} />
        </div>
        :
        <div className="sharePostPreview sharePreview">
          <ReplyToQuoteTweetPreview id={replyTo} />
        </div>
      :
      null
      }

      <div className="tweetBoxMain">
        <div className="tweetBoxInput">
          <div className="twitterPostAvatar">
            <Avatar 
              src={(userRegisterData['PROFILEPHOTO'] || "")} 
              className="twitterPostTopAvatar"
            />
          </div>
          <div className="tweetBoxTextAreaContainer">
            <textarea
              value={postMessage}
              autoFocus={true}
              onChange={({ target }) => updateTextAreaState(target.value)}
              className="tweetBoxTextArea"
              style={{ height: dynamicHeight }}
              type="text"
              placeholder={placeholderText} />
          </div>
        </div>
        {count > 0 && <p className='textAreaWordCount'>Total characters: {count}</p>}

        {avatar &&
          <div className="twitterMediaContainer">
            <img src={avatar} alt="upload pic" className="selectedFile" />
            <ClearIcon className="twitterOverlayButton" onClick={handleDelete} />
          </div>}
        {videoAvatar &&
          <div className="twitterMediaContainer">
            <video src={videoAvatar} className="selectedFile" />
            <ClearIcon className="twitterOverlayButton" onClick={handleDelete} />
          </div>}

        {/* quotetweet is similar to share tweet */}
        {quoteTweet ?
          retweetParentId ?
          <div className="sharePostPreview sharePreview">
            <ReplyToQuoteTweetPreview id={retweetParentId} />
          </div>
          :
          <div className="sharePostPreview sharePreview">
            <ReplyToQuoteTweetPreview id={quoteTweet} />
          </div>
        :
        null
        }

        <div className="tweetBoxBottom">
          <div className="twitterBoxBottomTop"></div>
          <div className="tweetBoxOtherButton">
            <IconButton className="tweetButtonMain" aria-label="upload media" component="label">
              <input
                type="file"
                hidden
                multiple={false}
                accept="image/*, video/*"
                onChange={(e) => mediaHandleChange(e)}
              />
              <PhotoLibraryIcon />
            </IconButton>

            <IconButton component="label" className="tweetButtonMain">
              <input
                type="file"
                hidden
                multiple={false}
                accept="image/gif"
                onChange={(e) => mediaHandleChange(e)}
              />
              <GifIcon />
            </IconButton>

            <IconButton component="label" className="tweetButtonMain">
              <PollOutlinedIcon />
            </IconButton>

            <IconButton component="label" className="tweetButtonMain">
              <SentimentSatisfiedOutlinedIcon />
            </IconButton>

            <IconButton component="label" className="tweetButtonMain">
              <EventOutlinedIcon />
            </IconButton>

            <div className="pushItemLeft">
              <Button
                className="tweetBoxButton"
                onClick={handleSubmit}
              >
                {socialMediaTranslations?.tweet || TW_TRANSLATIONS_DEFAULT.TWEET}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TweetBox;