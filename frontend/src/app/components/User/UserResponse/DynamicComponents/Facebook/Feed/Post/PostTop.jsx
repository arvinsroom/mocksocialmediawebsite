import "./Post.css";
import { useSelector } from "react-redux";
import { trackLinkClick } from '../../../../../../../services/tracking-service';
import { selectSinglePost } from '../../../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../../../selectors/socialMediaAuthors';
import DynamicMedia from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMedia';
import Text from '../../../../../../Common/UserCommon/SocialMediaPostType/Text';
import { Avatar } from "@material-ui/core";
import { useEffect, useState } from "react";
import Share from '../../../../../../Common/UserCommon/SocialMediaPostType/Share';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const PostTop = ({ id }) => {
  const singlePost = useSelector(state => selectSinglePost(state, id));
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
  useEffect(() => {
    setRenderSinglePost(
      <>
        {singlePost &&
          <>
            <div className="postTop">
              <Avatar
                src={singlePost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
                className="postTopAvatar"
              />
              <div className="postTopInfo">
                <h3>{singlePost.userPost ? (userRegisterData['USERNAME'] || "") : 
                  singleAuthor?.authorName || ""
                }</h3>
                <p>{singlePost.datePosted || ""}</p>
              </div>
              <div className="postTopThreeDots">
                <MoreHorizIcon />
              </div>
            </div>

            <Text postMessage={singlePost.postMessage} link={singlePost.link} />

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

            {singlePost.type === 'SHARE' ?
              <div className="sharePostPreview">
                <Share id={singlePost.parentPostId} />
              </div>
              : null}
          </>}
      </>
    );
  }, [id])

  return (
    <>
      {renderSinglePost ? renderSinglePost : null}
    </>
  );
}

export default PostTop;
