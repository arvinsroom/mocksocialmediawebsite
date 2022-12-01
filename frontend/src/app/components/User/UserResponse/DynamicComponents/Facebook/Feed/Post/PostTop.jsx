import "./Post.css";
import { useSelector, useDispatch } from "react-redux";
import { trackLinkClick } from '../../../../../../../services/user-tracking-service';
import { selectSinglePost, selectPostsMetadata } from '../../../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../../../selectors/socialMediaAuthors';
import Text from '../../../../../../Common/UserCommon/SocialMediaPostType/Text';
import { Avatar } from "@material-ui/core";
import { useEffect, useState } from "react";
import Share from '../../../../../../Common/UserCommon/SocialMediaPostType/Share';
import DynamicMedia from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMedia';
import DynamicMediaProfile from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMediaProfile';
import { reportPost, unreportPost } from '../../../../../../../actions/socialMedia';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
// import { SmsFailedOutlined } from '@material-ui/icons/'

const PostTop = ({ id }) => {
  const singlePost = useSelector(state => selectSinglePost(state, id));
  const singleAuthor = useSelector(state => selectSocialMediaAuthor(state, singlePost.authorId));
  const userRegisterData = useSelector(state => state.userRegister.metaData);

  const postMetadata = useSelector(state => selectPostsMetadata(state, id));
  const dispatch = useDispatch();
  //states for report functionality
  const [reportText, setReportText] = useState("Report")
  const [reportIconColor, setReportIconColor] = useState(null)

  const [renderSinglePost, setRenderSinglePost] = useState(null);
  function storeLinkClick() {
    const track = {
      action: 'LINKCLICK',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  }

  //handle on report click
  //first we check if it reported already, if so we unreport it
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

  useEffect(() => {
    setRenderSinglePost(
      <>
        {singlePost &&
          <>
            <div className="postTop">
            {
              //added the posibility to display an author profile image, if no image found, it display a user profile image, and if not found, it will display an mui avatar.
              singlePost.attachedAuthorPicture ? 
                <DynamicMediaProfile attachedMedia={singlePost.attachedAuthorPicture} customCSS="fbAuthorProfileImage" /> :
                <Avatar
                  src={singlePost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
                  className="fbPostTopAvatar"
                />
              }
              <div className="postTopInfo">
                <h3>{singlePost.userPost ? (userRegisterData['USERNAME'] || "") : 
                  singleAuthor?.authorName || ""
                }</h3>
                <p>{singlePost.datePosted || ""}</p>
              </div>
              <div className="postTopThreeDots">
                <MoreHorizIcon />
              </div>
              {/* <div className="report-container" onClick={handleToggleReport}>
                <SmsFailedOutlined fontSize="small" style={{ color: reportIconColor }} />
                <p className="defaultText report-text">{reportText}</p>
              </div> */}
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
                  <div className="fbPostdescriptions">
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
  }, [id, postMetadata])

  return (
    <>
      {renderSinglePost ? renderSinglePost : null}
    </>
  );
}

export default PostTop;
