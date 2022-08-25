import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from '@material-ui/core';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import ReplyTo from "../../../../../../Common/UserCommon/SocialMediaPostType/ReplyTo";
import { trackLinkClick } from '../../../../../../../services/user-tracking-service';
import { selectSinglePost } from '../../../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../../../selectors/socialMediaAuthors';
import Text from '../../../../../../Common/UserCommon/SocialMediaPostType/Text';
import DynamicMedia from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMedia';
import DynamicMediaProfile from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMediaProfile';
import { getFacebookPost } from '../../../../../../../actions/socialMedia';

const QuoteTweet = ({ id }) => {
  const dispatch = useDispatch();
  const [singlePost, setSinglePost] = useState(useSelector(state => selectSinglePost(state, id)));
  const singleAuthor = useSelector(state => selectSocialMediaAuthor(state, singlePost?.authorId));
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [renderSinglePost, setRenderSinglePost] = useState(null);

  function storeLinkClick() {
    const track = {
      action: 'LINKCLICK',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  }

  const getSinglePost = async () => {
    setSinglePost(await dispatch(getFacebookPost({ postIds: [id]})));
  };

  useEffect(() => {
    if (singlePost) {
      setRenderSinglePost(
          <>
          <div className="sharePostPreview">
            <div className="twitterPost">

              <div className="twitterPostAvatar">
                {
                  singlePost.attachedAuthorPicture ? <DynamicMediaProfile attachedMedia={singlePost.attachedAuthorPicture} /> :
                    <Avatar
                      src={singlePost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
                      className="postTopAvatar"
                    />
                }
              </div>

              <div className="twitterPostBody">
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
                  </div>
                  </>

                  {/* for replyTo add the text for the parent post handle */}
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
                    </div>
                </div>
            </div>
          </div>
          </>
      );
    } else {
      getSinglePost();
    }
  }, [singlePost, singleAuthor]);


  return (
    <div>
      {renderSinglePost ? renderSinglePost : null}
    </div>
  );
}

export default QuoteTweet;