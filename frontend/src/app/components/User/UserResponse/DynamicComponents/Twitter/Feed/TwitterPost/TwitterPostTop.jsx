import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Button, Menu, MenuItem } from '@material-ui/core';
import FavoriteIcon from "@material-ui/icons/Favorite";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ReplyTo from "../../../../../../Common/UserCommon/SocialMediaPostType/ReplyTo";
import { TW_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';
import { parseNumber } from '../../../../../../../utils';
import { trackLinkClick } from '../../../../../../../services/user-tracking-service';
import { selectSinglePost, selectPostsMetadata } from '../../../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../../../selectors/socialMediaAuthors';
import Text from '../../../../../../Common/UserCommon/SocialMediaPostType/Text';
import DynamicMedia from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMedia';
import DynamicMediaProfile from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMediaProfile';
import { FlagOutlined } from '@material-ui/icons/';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { reportPost, unreportPost } from '../../../../../../../actions/socialMedia';

import "./TwitterPost.css";
import QuoteTweet from "../QuoteTweet/QuoteTweet";

const TwitterPostTop = ({ id }) => {
  const singlePost = useSelector(state => selectSinglePost(state, id));
  const socialMediaTranslations = useSelector(state => state.socialMedia.socialMediaTranslations);
  const singleAuthor = singlePost?.authorId ? useSelector(state => selectSocialMediaAuthor(state, singlePost.authorId)) : null;
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [renderSinglePost, setRenderSinglePost] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [quoteTweetPost, setQuoteTweetPost] = useState(null);

  const postMetadata = useSelector(state => selectPostsMetadata(state, id));
  const dispatch = useDispatch();

  //states for report functionality
  const [reportText, setReportText] = useState("Report");
  const [reportIconColor, setReportIconColor] = useState(null);

  function storeLinkClick() {
    const track = {
      action: 'LINKCLICK',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  }

  //handle on report click
  //first we check if it is reported already, if so we unreport it
  //otherwise we report it 
  const handleToggleReport = () => {
    if (postMetadata.reportId) {
      dispatch(unreportPost(postMetadata.reportId, id))
      setReportText("Report")
      setReportIconColor(null)
    } else {
      const data = {
        action: 'REPORT',
        comment: null,
        userPostId: id,
      };
      dispatch(reportPost(data, id));
      setReportText("Reported")
      setReportIconColor("#DF5F5F")
    }
  };

  function formLikedOrRetweetStr(by, ships, overflow, likeOrRetweet) {
    let relationships = [...ships];
    if (by.length === 0 && overflow) return `${overflow} friends ${likeOrRetweet}`;
    const valuesAvail = [];
    for (let i = 0; i < by.length; ++i) {
      const index = parseNumber(by[i]);
      if (index && index > -1 && index < relationships.length && relationships[index] !== '') {
        valuesAvail.push(relationships[index]);
        relationships[index] = '';
      }
    }

    if (valuesAvail < 1 || valuesAvail.length !== by.length) {
      // try to see if there is any other value present in relationships array
      for (let i = 1; i < relationships.length; ++i) {
        if (relationships[i] !== '') {
            valuesAvail.push(relationships[i]);
            if (valuesAvail.length === by.length) break;
        }
      }
    }

    if (valuesAvail.length < 1) {
      if (overflow) return `${overflow} friends ${likeOrRetweet}`
      return null;
    } else if (valuesAvail.length === 1) {
      if (overflow) {
        return `${valuesAvail[0]} and ${overflow} others ${likeOrRetweet}`
      } else return `${valuesAvail[0]} ${likeOrRetweet}`
    } else {
      if (overflow) {
        return `${valuesAvail[0]} and ${overflow} others ${likeOrRetweet}`
      } else return `${valuesAvail[0]} and ${valuesAvail[1]} ${likeOrRetweet}`
    }
  }

  const handleClick = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // if we more that 2 name and also overflow property then show other...???
  function getLikedOrRetweetedBy() {
    if (!userRegisterData.RELATIONSHIP || userRegisterData.RELATIONSHIP.length < 2) return null;
    const likedBy = singlePost.likedBy ? singlePost.likedBy.split(",") : [];
    const likedByOverflow = parseNumber(singlePost.likedByOverflow) ? parseNumber(singlePost.likedByOverflow) : null;
    const retweetedBy = singlePost.retweetedBy ? singlePost.retweetedBy.split(",") : [];
    const retweetedByOverflow = parseNumber(singlePost.retweetedByOverflow) ? parseNumber(singlePost.retweetedByOverflow) : null;

    if (likedBy.length > 0 || likedByOverflow) return formLikedOrRetweetStr(likedBy, userRegisterData.RELATIONSHIP, likedByOverflow, 'liked')
    else if (retweetedBy.length > 0 || retweetedByOverflow) return formLikedOrRetweetStr(retweetedBy, userRegisterData.RELATIONSHIP, retweetedByOverflow, 'retweeted');

    return null;
  }

  useEffect(() => {
    const likedOrRetweetComp = getLikedOrRetweetedBy();
    setRenderSinglePost(
    <>
      {singlePost &&
      <>
       {singlePost.type === 'RETWEET' && 
        <div className="twitterRetweeted">
          <ChatBubbleOutlineIcon fontSize="small" /> &nbsp;&nbsp;&nbsp; {socialMediaTranslations?.you_retweeted || TW_TRANSLATIONS_DEFAULT.YOU_RETWEETED}</div>
       }
        
        {likedOrRetweetComp ? 
            <div className="likedOrRetweetComp">
              <FavoriteIcon fontSize="small" /> {likedOrRetweetComp}
            </div>  : null}
        <div className="twitterPost">

          {singlePost.type === 'RETWEET' ? 
            <TwitterPostTop id={singlePost.parentPostId} /> :
            <div>
              <div className="twitterPostAvatar">
                {
                  singlePost.attachedAuthorPicture ? <DynamicMediaProfile attachedMedia={singlePost.attachedAuthorPicture} /> :
                    <Avatar
                      src={singlePost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
                      className="postTopAvatar"
                    />
                }
              </div>
              {/* to show a line in the left side of a post to indicate that is a thread, not being used at the moment */}
              {/* {displayLine && <div className="vertical-line"></div>} */}
            </div>
          }

          <div className="twitterPostBody">
            {singlePost.type === 'RETWEET' ? null :
              <>
              <div className="twitterPostHeaderMain">
                <h3 className="twitterPostHeaderInfo">
                  {/* username from registration page */}
                  {singlePost.userPost ? (userRegisterData['USERNAME'] || "") : 
                    singleAuthor?.authorName || ""
                  }
                  {" "}
                  <span className="twitterPostHeaderSpecial">
                    {singleAuthor?.authorVerified ? <VerifiedUserIcon className="twitterPostBadge" /> : null}
                    {" "}
                    {/* twitter handle from registration page */}
                    {singlePost.userPost ? (userRegisterData['HANDLE'] || "") : 
                      singleAuthor?.handle || ""
                    }
                    {" "}
                    {singlePost.isReplyTo !== null && singlePost.userPost === true ? "2s" : singlePost.datePosted || ""}
                  </span>
                </h3>

                {/* <Button variant="outlined" component="label" className="tweetBoxIcons" onClick={handleClick}>
                  <RepeatOutlinedIcon fontSize="small" />
                </Button> */}

                <div className="twitterPostHeaderThreeDots">
                  <Button onClick={handleClick}>
                    <MoreHorizIcon />
                  </Button>
                </div>
              </div>
              <Menu
                  id="simple-menu"
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem disabled={singlePost.userPost}>
                    <div className="report-container-tw" onClick={handleToggleReport}>
                      <FlagOutlined fontSize="small" style={{ color: reportIconColor, transform: "scaleX(-1)" }} />
                      <p className="defaultText report-text-tw">{reportText}</p>
                    </div>
                  </MenuItem>
                </Menu>
              </>
            }
              {singlePost.isReplyTo !== null && singlePost.userPost === true ?
                <ReplyTo id={singlePost.isReplyTo} />
              : null}

              {singlePost.postMessage &&
                <div className="twitterPostHeaderDescription">
                  <Text postMessage={singlePost.postMessage} link={singlePost.link} customClassName="twitterPostTopText"/>
                </div>
              }

              <div className="twitterPostMediaBox">
                {(singlePost.type === 'PHOTO' || singlePost.type === 'VIDEO') &&
                  <DynamicMedia attachedMedia={singlePost.attachedMedia[0]} />
                }

                {singlePost.type === 'LINK' ?
                  <a href={singlePost.link} className="link-preview" onClick={storeLinkClick} target="_blank" rel="noopener noreferrer">
                    <div className="link-area">
                      <div className="og-image">
                        <DynamicMedia attachedMedia={singlePost.attachedMedia[0]} />
                      </div>
                      <div className="descriptions">
                        <div className="og-title">
                          {singlePost.linkTitle}
                        </div>
                        <div className="og-description">
                          {singlePost.linkPreview}
                        </div>
                      </div>
                    </div>
                  </a>
                  : null}

                {singlePost.quoteTweetTo ?
                      <QuoteTweet id={singlePost.quoteTweetTo} />
                  : null
                }
                </div>
            </div>
        </div>
      </>
      }
    </>
  );
}, [id, postMetadata, anchorEl]);

  return (
    <>
      < div>
        {/* the padding left inline styling is to move the post to the left to indicate that is a reply to a reply */}
        {renderSinglePost ? renderSinglePost : null}
      </ div>
    </>
  );
}

export default TwitterPostTop;