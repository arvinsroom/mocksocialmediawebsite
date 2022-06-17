import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Avatar } from '@material-ui/core';
import FavoriteIcon from "@material-ui/icons/Favorite";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ReplyTo from "../../../../../../Common/UserCommon/SocialMediaPostType/ReplyTo";
import { TW_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';
import { parseNumber } from '../../../../../../../utils';
import { trackLinkClick } from '../../../../../../../services/user-tracking-service';
import { selectSinglePost } from '../../../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../../../selectors/socialMediaAuthors';
import DynamicMedia from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMedia';
import Text from '../../../../../../Common/UserCommon/SocialMediaPostType/Text';
import "./TwitterPost.css";

const TwitterPostTop = ({ id }) => {
  const singlePost = useSelector(state => selectSinglePost(state, id));
  // selector for authors data
  const socialMediaTranslations = useSelector(state => state.socialMedia.socialMediaTranslations);
  const singleAuthor = useSelector(state => selectSocialMediaAuthor(state, singlePost.authorId));
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [renderSinglePost, setRenderSinglePost] = useState(null);

  function storeLinkClick() {
    const track = {
      action: 'LINKCLICK',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  }

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
            <div className="twitterPostAvatar">
              <Avatar
                src={singlePost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
                className="postTopAvatar"
              />
            </div>
          }

          <div className="twitterPostBody">
          {/* {likedOrRetweetComp ? 
            <div className="likedOrRetweetComp">
              
            </div>  : null} */}
            {singlePost.type === 'RETWEET' ? null :
              <div className="twitterPostHeaderText">
                <h3>
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
                    {singlePost.type === 'REPLYTO' ? "2s" : singlePost.datePosted || ""}
                  </span>
                </h3>
              </div>
            }

              {/* for replyTo add the text for the parent post handle */}
              {singlePost.type === 'REPLYTO' ?
                <ReplyTo id={singlePost.parentPostId} />
              : null}

              {singlePost.postMessage &&
                <div className="twitterPostHeaderDescription">
                  <Text postMessage={singlePost.postMessage} link={singlePost.link} customClassName="twitterPostTopText"/>
                </div>
              }

              <div className="twitterPostMediaBox">
                {(singlePost.type === 'PHOTO' || singlePost.type === 'VIDEO' ||
                  singlePost.type === 'REPLYTO' || singlePost.type === 'QUOTETWEET') &&
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

                {singlePost.type === 'QUOTETWEET' ?
                    <div className="sharePostPreview">
                      <TwitterPostTop id={singlePost.parentPostId} />
                    </div>
                  : null
                }
                </div>
            </div>
        </div>
      </>
      }
    </>
  );
}, [id]);

  return (
    <>
      {renderSinglePost ? renderSinglePost : null}
    </>
  );
}

export default TwitterPostTop;