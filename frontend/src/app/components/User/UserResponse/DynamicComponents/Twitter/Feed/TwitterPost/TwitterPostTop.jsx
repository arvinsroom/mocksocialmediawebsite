import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, Menu, MenuItem, IconButton } from '@material-ui/core';
import ReplyTo from "../../../../../../Common/UserCommon/SocialMediaPostType/ReplyTo";
import { TW_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';
import { parseNumber } from '../../../../../../../utils';
import { selectSinglePost, selectPostsMetadata } from '../../../../../../../selectors/socialMedia';
import Text from '../../../../../../Common/UserCommon/SocialMediaPostType/Text';
import DynamicMedia from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMedia';
import DynamicMediaProfile from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMediaProfile';
import { FlagOutlined } from '@material-ui/icons/';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { reportPost, unreportPost } from '../../../../../../../actions/socialMedia';
import PostHeaderDisplay from "../../../../../../Common/UserCommon/Twitter/PostHeaderDisplay/PostHeaderDisplay";
import InteractionRetweet from '../../../../../../../../assets/Twitter/interaction-retweet.svg';
import InteractionLike from '../../../../../../../../assets/Twitter/interaction-like.svg';
import QuoteTweet from "../QuoteTweet/QuoteTweet";
import DynamicLink from "../../../../../../Common/UserCommon/Twitter/DynamicLink/DynamicLink";
import "./TwitterPost.css";

const TwitterPostTop = ({ id }) => {
  const singlePost = useSelector(state => selectSinglePost(state, id));
  const socialMediaTranslations = useSelector(state => state.socialMedia.socialMediaTranslations);
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [renderSinglePost, setRenderSinglePost] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [retweetOrLikeIcon, setRetweetOrLikeIcon] = useState(null);

  const FRIENDS = socialMediaTranslations?.friends || TW_TRANSLATIONS_DEFAULT.FRIENDS;
  const AND = socialMediaTranslations?.and || TW_TRANSLATIONS_DEFAULT.AND;
  const OTHERS = socialMediaTranslations?.others || TW_TRANSLATIONS_DEFAULT.OTHERS;
  const LIKED = socialMediaTranslations?.liked || TW_TRANSLATIONS_DEFAULT.LIKED;
  const RETWEETED = socialMediaTranslations?.retweeted || TW_TRANSLATIONS_DEFAULT.RETWEETED;
  const REPORT = socialMediaTranslations?.report || TW_TRANSLATIONS_DEFAULT.REPORT;
  const REPORTED = socialMediaTranslations?.reported || TW_TRANSLATIONS_DEFAULT.REPORTED;

  const postMetadata = useSelector(state => selectPostsMetadata(state, id));
  const dispatch = useDispatch();

  //states for report functionality
  const [reportText, setReportText] = useState(REPORT);
  const [reportIconColor, setReportIconColor] = useState(null);

  //handle on report click
  //first we check if it is reported already, if so we unreport it
  //otherwise we report it 
  const handleToggleReport = () => {
    if (postMetadata.reportId) {
      dispatch(unreportPost(postMetadata.reportId, id))
      setReportText(REPORT)
      setReportIconColor(null)
    } else {
      const data = {
        action: 'REPORT',
        comment: null,
        userPostId: id,
      };
      dispatch(reportPost(data, id));
      setReportText(REPORTED)
      setReportIconColor("#DF5F5F")
    }
  };

  function formLikedOrRetweetStr(by, ships, overflow, likeOrRetweet) {
    let relationships = [...ships];
    if (by.length === 0 && overflow) return `${overflow} ${FRIENDS} ${likeOrRetweet}`;
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
      if (overflow) return `${overflow} ${FRIENDS} ${likeOrRetweet}`
      return null;
    } else if (valuesAvail.length === 1) {
      if (overflow) {
        const nameBreak = valuesAvail[0].length > 39 ? valuesAvail[0].substr(0, 36) + "..." : valuesAvail[0];
        return `${nameBreak} ${AND} ${overflow} ${OTHERS} ${likeOrRetweet}`
      } else {
        const nameBreak = valuesAvail[0].length > 55 ? valuesAvail[0].substr(0, 52) + "..." : valuesAvail[0];
        return `${nameBreak} ${likeOrRetweet}`
      }
    } else {
      if (overflow) {
        const nameBreak = valuesAvail[0].length > 39 ? valuesAvail[0].substr(0, 36) + "..." : valuesAvail[0];
        return `${nameBreak} ${AND} ${overflow} ${OTHERS} ${likeOrRetweet}`
      } else {
        const nameBreak = valuesAvail[0].length > 25 ? valuesAvail[0].substr(0, 22) + "..." : valuesAvail[0];
        const nameBreak2 = valuesAvail[1].length > 24 ? valuesAvail[1].substr(0, 21) + "..." : valuesAvail[1];
        return `${nameBreak} ${AND} ${nameBreak2} ${likeOrRetweet}`
      }
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

    if (likedBy.length > 0 || likedByOverflow) {
      setRetweetOrLikeIcon('LIKE');
      return formLikedOrRetweetStr(likedBy, userRegisterData.RELATIONSHIP, likedByOverflow, LIKED)
    }
    else if (retweetedBy.length > 0 || retweetedByOverflow) {
      setRetweetOrLikeIcon('RETWEET');
      return formLikedOrRetweetStr(retweetedBy, userRegisterData.RELATIONSHIP, retweetedByOverflow, RETWEETED);
    }

    return null;
  }

  useEffect(() => {
    if (singlePost) {
      const likedOrRetweetComp = getLikedOrRetweetedBy();
      setRenderSinglePost(
      <>
        {singlePost.type === 'RETWEET' && 
          <div className="twitterRetweeted">
            <div className="twitterRetweetedIcon">
              <InteractionRetweet 
                className="twUserPostRetweet"
              />

            </div>
            <div className="twitterRetweetedText">
              {socialMediaTranslations?.you_retweeted || TW_TRANSLATIONS_DEFAULT.YOU_RETWEETED}
            </div>
          </div>
        }
        
        {likedOrRetweetComp ? 
            <div className="twitterRetweeted">
              <div className="twitterRetweetedIcon">
                {retweetOrLikeIcon === 'RETWEET' && 
                  <InteractionRetweet 
                    className="twUserPostRetweet"
                  />}
                {retweetOrLikeIcon === 'LIKE' && 
                  <InteractionLike className="twUserPostLike"/>
                }
              </div>
              <div className="twitterRetweetedText">
                {likedOrRetweetComp}
              </div>
            </div>  : null}
          
        {singlePost.type === 'RETWEET' ?
            <TwitterPostTop id={singlePost.parentPostId} /> :

          <div className="twitterPost">
            <div className="twitterPostAvatar">
              {
                singlePost.attachedAuthorPicture ? 
                  <DynamicMediaProfile attachedMedia={singlePost.attachedAuthorPicture} customCSS="twAuthorProfileImage" /> :
                  <Avatar
                    src={singlePost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
                    className="twitterPostTopAvatar"
                  />
              }
            </div>
            <div className="twitterPostBody">
              {singlePost.type === 'RETWEET' ? null :
                <>
                  <div className="twitterPostHeaderMain">
                    <PostHeaderDisplay id={id} />
                    <div className="twitterPostHeaderThreeDots">
                      <IconButton 
                        component="label" 
                        className="tweetTopHeaderDots"
                        onClick={handleClick}
                      >
                      <MoreHorizIcon />
                      </IconButton>
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
              
              {singlePost.isReplyTo !== null && <ReplyTo id={singlePost.isReplyTo} /> }

              {singlePost.postMessage &&
                <div className="twitterPostHeaderDescription">
                  <Text postMessage={singlePost.postMessage} link={singlePost.link} customClassName="twitterPostTopText" charLimit={280}/>
                </div>
              }

              <div className="twitterPostMediaBox">
                {(singlePost.type === 'PHOTO' || singlePost.type === 'VIDEO') &&
                  <DynamicMedia attachedMedia={singlePost.attachedMedia[0]} customCSS="twitterAllRoundBorder"/>
                }

                {singlePost.type === 'LINK' ?
                  <DynamicLink id={id} />
                  :
                  null}

                {singlePost.quoteTweetTo ?
                  <QuoteTweet id={singlePost.quoteTweetTo} />
                : null
                }
              </div>
            </div>
          </div>
        }
      </>
      )
    }
  }, [id, postMetadata, anchorEl, singlePost, retweetOrLikeIcon]);

  return (
    <div>
      {/* the padding left inline styling is to move the post to the left to indicate that is a reply to a reply */}
      {renderSinglePost ? renderSinglePost : null}
    </div>
  );
}

export default TwitterPostTop;