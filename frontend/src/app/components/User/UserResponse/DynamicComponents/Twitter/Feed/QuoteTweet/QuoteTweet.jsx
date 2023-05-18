import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar } from '@material-ui/core';
import ReplyTo from "../../../../../../Common/UserCommon/SocialMediaPostType/ReplyTo";
import { selectSinglePost } from '../../../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../../../selectors/socialMediaAuthors';
import Text from '../../../../../../Common/UserCommon/SocialMediaPostType/Text';
import DynamicMedia from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMedia';
import DynamicMediaProfile from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMediaProfile';
import { getFacebookPost } from '../../../../../../../actions/socialMedia';
// import PostHeaderDisplay from "../../../../../../Common/UserCommon/Twitter/PostHeaderDisplay/PostHeaderDisplay";
import VerifiedIcon from '../../../../../../../../assets/Twitter/verified-icon.svg';
import { parseUserRegisterName } from '../../../../../../../utils';
import "./QuoteTweet.css";
import { trackUserClick } from "../../../../../../../actions/userTracking";

const QuoteTweet = ({ id, preview }) => {
  const dispatch = useDispatch();
  const [singlePost, setSinglePost] = useState(useSelector(state => selectSinglePost(state, id)));
  const singleAuthor = useSelector(state => selectSocialMediaAuthor(state, singlePost?.authorId));
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [renderSinglePost, setRenderSinglePost] = useState(null);

  const getSinglePost = async () => {
    setSinglePost(await dispatch(getFacebookPost({ postIds: [id]})));
  };

  function storeLinkClick() {
    const track = {
      action: 'LINKCLICK',
      userPostId: id
    };
    dispatch(trackUserClick(track));
  }

  useEffect(() => {
    if (singlePost) {
      setRenderSinglePost(
          <div className={preview ? "twitterQuoteTweetBorderBox" : "twitterQuoteTweetBorderBox twitterQuoteTweetBorderBoxPhone"}>
            <div className="twitterPostQuoteTweet">
              <div className="twitterPostAvatarQuoteTweet">
                {
                  singlePost.attachedAuthorPicture ? 
                    <DynamicMediaProfile attachedMedia={singlePost.attachedAuthorPicture} customCSS="twAuthorProfileImage" /> :
                    <Avatar
                      src={singlePost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
                      style={{ height: '20px', width: '20px' }}
                    />
                }

                 {/* Problem */}
                <div className="twitterPostHeaderMainQuoteTweet">
                  {/* <PostHeaderDisplay id={id} /> */}

                  {/* TODO: Folliwing code is copied from PostHeaderDisplay AS IS.
                      Problem: When we pass some postID to quoteTweetTo column in spreadsheet and that post hasn't been rendered yet we have
                      to pull that post on the fly and it is not cached as of now. Therefore on line 25 I pull them again. */}
                  <>
                    <div className="dynamicPostHeaderInfo">
                      {/* username from registration page */}
                      {singlePost.userPost ? (parseUserRegisterName(userRegisterData)) : 
                        singleAuthor?.authorName || ""
                      }
                    </div>
                    
                    {singleAuthor?.authorVerified ? 
                    <>
                      <VerifiedIcon className="dynamicPostBadge"/>
                    </> : null}
                  
                    <span className="dynamicPostHeaderHandle">
                      {singlePost.userPost ? 
                      <div>
                        {userRegisterData['HANDLE'] || null}
                      </div> : 
                      <div>
                        {singleAuthor?.handle  || null}
                      </div>}
                    </span>

                    <span className="dynamicPostHeaderTime">
                      {singlePost.isReplyTo !== null && singlePost.userPost === true ? 
                      <div>
                        <span>&#183;</span>
                        {"2s"}
                      </div> : 
                      singlePost.datePosted ?
                      <div>
                        <span>&#183;</span>
                        {singlePost.datePosted}
                      </div>
                      : null}
                    </span>
                  </>
                </div>
              </div>

              <div className="twitterPostBody">
                  {/* for replyTo add the text for the parent post handle */}
                  {singlePost.isReplyTo !== null && singlePost.userPost === true ?
                    <ReplyTo id={singlePost.isReplyTo} />
                  : null}

                  {singlePost.postMessage &&
                    <div className="twitterPostHeaderDescriptionQuoteTweet">
                      <Text postMessage={singlePost.postMessage} link={singlePost.link} customClassName="twitterPostTopText" charLimit={280}/>
                    </div>
                  }

                  <div className="twitterPostMediaBox">
                    {(singlePost.type === 'PHOTO' || singlePost.type === 'VIDEO') &&
                      <DynamicMedia attachedMedia={singlePost.attachedMedia[0]} customCSS="twitterAllRoundBorder" />
                    }

                    {singlePost.type === 'LINK' ?
                      <a href={singlePost.link} className="twitter-link-preview" onClick={storeLinkClick} target="_blank" rel="noopener noreferrer">
                      {singlePost.attachedMedia[0] && (singlePost.linkTitle || singlePost.linkPreview) ?
                        <>
                          <DynamicMedia attachedMedia={singlePost.attachedMedia[0]}/>
                          <div className="twitterPaddingLeftAndRight">
                            <div className="twitter-og-title">
                              {singlePost.linkTitle}
                            </div>
                            <div className="twitter-og-description">
                              {singlePost.linkPreview}
                            </div>
                          </div>
                        </>
                        :
                        <>
                          {singlePost.attachedMedia[0] ?
                            <DynamicMedia attachedMedia={singlePost.attachedMedia[0]} />
                            :
                            (singlePost.linkTitle || singlePost.linkPreview) ?
                              <div className="twitterPaddingLeftAndRight">
                                <div className="twitter-og-title">
                                  {singlePost.linkTitle}
                                </div>
                                <div className="twitter-og-description">
                                  {singlePost.linkPreview}
                                </div>
                              </div>
                              :
                              null
                          }
                        </>
                      }
                    </a>
                      :
                    null}
                    </div>
                </div>
            </div>
        </div>
      );
    } else {
      getSinglePost();
    }
  }, [id, singlePost, singleAuthor]);


  return (
    <div>
      {renderSinglePost ? renderSinglePost : null}
    </div>
  );
}

export default QuoteTweet;