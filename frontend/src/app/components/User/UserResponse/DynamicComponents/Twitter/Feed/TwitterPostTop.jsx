import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { trackLinkClick } from '../../../../../../services/tracking-service';
import { selectSinglePost } from '../../../../../../selectors/facebook';
import Photo from '../../Facebook/Feed/Post/PostType/Photo';
import Video from '../../Facebook/Feed/Post/PostType/Video';
import Text from '../../Facebook/Feed/Post/PostType/Text';
import { Avatar } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ChatBubbleOutlineIcon from "@material-ui/icons/ChatBubbleOutline";
import ReplyTo from "../../Facebook/Feed/Post/PostType/ReplyTo";
import Share from '../../Facebook/Feed/Post/PostType/Share';
import "./TwitterPost.css";

const TwitterPostTop = ({ id }) => {
  const singlePost = useSelector(state => selectSinglePost(state, id));
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [renderSinglePost, setRenderSinglePost] = useState(null);

  function storeLinkClick() {
    const track = {
      action: 'LINKCLICK',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  }

  useEffect(() => {
    setRenderSinglePost(
    <>
      {singlePost &&
      <>
       {singlePost.type === 'RETWEET' && 
        <div className="twitterRetweeted"><ChatBubbleOutlineIcon fontSize="small" /> &nbsp;&nbsp;&nbsp; You Retweeted</div>
       }

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
            {singlePost.type === 'RETWEET' ? null :
              <div className="twitterPostHeaderText">
                <h3>
                  {/* username from registration page */}
                  {singlePost.userPost ? (userRegisterData['USERNAME'] || "") : ""}
                  {" "}
                  <span className="twitterPostHeaderSpecial">
                    {/* {singlePost.authorVerified && <VerifiedUserIcon className="twitterPostBadge" />} */}
                    {/* twitter handle from registration page */}
                    {singlePost.userPost ? (userRegisterData['HANDLE'] || "") : ""}
                    {singlePost.datePosted || ""}
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
                {singlePost.type === 'PHOTO' ?
                  <Photo attachedMedia={singlePost.attachedMedia[0]} />
                  : null}

                {singlePost.type === 'VIDEO' ?
                  <Video attachedMedia={singlePost.attachedMedia[0]} />
                  : null}

                {singlePost.type === 'LINK' ?
                  <a href={singlePost.link} className="link-preview" onClick={storeLinkClick} target="_blank" rel="noopener noreferrer">
                    <div className="link-area">
                      <div className="og-image">
                        <Photo attachedMedia={singlePost.attachedMedia[0]} />
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

                {/* {singlePost.type === 'SHARE' ?
                  <div className="sharePostPreview">
                    <Share id={singlePost.parentPostId} />
                  </div>
                  : null} */}

                {singlePost.type === 'QUOTETWEET' ?
                    <div className="sharePostPreview">
                      <Share id={singlePost.parentPostId} />
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