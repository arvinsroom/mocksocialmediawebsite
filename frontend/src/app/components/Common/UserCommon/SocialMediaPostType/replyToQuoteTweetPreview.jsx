import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DynamicMedia from './DynamicMedia';
import Text from './Text';
import { Avatar } from "@material-ui/core";
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import { selectSinglePost } from '../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../selectors/socialMediaAuthors';

const replyToQuoteTweetPreview = ({ id }) => {
  const parentSharedPost = useSelector(state => selectSinglePost(state, id));
  const singleAuthor = useSelector(state => selectSocialMediaAuthor(state, parentSharedPost.authorId));
  const [renderSharePost, setRenderSharePost] = useState(null);
  const userRegisterData = useSelector(state => state.userRegister.metaData);

  useEffect(() => {
    if (parentSharedPost) {
      setRenderSharePost(
        <div className="post">
          <div className="postTop">
            <Avatar
              src={parentSharedPost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
              className="postTopAvatar"
            />
            <div className="postTopInfo">
            <h3>{
                  parentSharedPost.userPost ? (userRegisterData['USERNAME'] || "") : 
                  (singleAuthor?.authorName || "")
                }
                {" "}
                <span className="twitterPostHeaderSpecial">
                  {singleAuthor?.authorVerified ? <VerifiedUserIcon className="twitterPostBadge" /> : null}
                  {" "}
                  {/* twitter handle from registration page */}
                  {parentSharedPost.userPost ? (userRegisterData['HANDLE'] || "") : 
                    singleAuthor?.handle || ""
                  }
                  {" "}
                  {parentSharedPost.datePosted || ""}
                </span>
            </h3>
            </div>
          </div>

          <Text className="postMessage" postMessage={parentSharedPost.postMessage} link={parentSharedPost.link} />

          {(parentSharedPost.type === 'PHOTO' || parentSharedPost.type === 'VIDEO') &&
            <DynamicMedia attachedMedia={parentSharedPost.attachedMedia[0]} />
          }

          {parentSharedPost.type === 'LINK' ?
            <a href={parentSharedPost.link} className="link-preview" target="_blank" rel="noopener noreferrer">
              <div className="link-area">
                <div className="og-image">
                  <DynamicMedia attachedMedia={parentSharedPost.attachedMedia[0]} />
                </div>
                <div className="descriptions">
                  <div className="og-title">
                    {parentSharedPost.linkTitle}
                  </div>
                  <div className="og-description">
                    {parentSharedPost.linkPreview}
                  </div>
                </div>
              </div>
            </a>
            : null}
        </div>
      );
    }
  }, [parentSharedPost])

  return (
    <>
      {renderSharePost ? renderSharePost : null}
    </>
  );
}

export default replyToQuoteTweetPreview;