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
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { 
  reportPost,
  unreportPost,
  getFacebookPost
} from '../../../../../../../actions/socialMedia';
// import "./TwitterPost.css";

const QuoteTweet = ({ id }) => {
  const dispatch = useDispatch();
  // const singlePost = useSelector(state => selectSinglePost(state, id));
  const [singlePost, setSinglePost] = useState(null);
  // selector for authors data
  const socialMediaTranslations = useSelector(state => state.socialMedia.socialMediaTranslations);
  // const singleAuthor = singlePost && singlePost.authorId ? useSelector(state => selectSocialMediaAuthor(state, singlePost.authorId)) : null;
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  // const [renderSinglePost, setRenderSinglePost] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  // const postMetadata = useSelector(state => selectPostsMetadata(state, id));

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
  // const handleToggleReport = () => {
  //   if (postMetadata.reportId) {
  //     dispatch(unreportPost(postMetadata.reportId, id))
  //     setReportText("Report")
  //     setReportIconColor(null)
  //   } else {
  //     const data = {
  //       action: 'REPORT',
  //       comment: null,
  //       userPostId: id,
  //     };
  //     dispatch(reportPost(data, id));
  //     setReportText("Reported")
  //     setReportIconColor("#DF5F5F")
  //   }
  // };

  const handleClick = (e) => {
    e.preventDefault();
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getSinglePost = async () => {
    setSinglePost(await dispatch(getFacebookPost({ postIds: [id]})));
  };

  useEffect(() => {
    // let cacheSinglePost = useSelector(state => selectSinglePost(state, id));
    // if (cacheSinglePost) {
    //   setSinglePost(cacheSinglePost);
    // } else {
      getSinglePost();
    // }
  }, []);


  return (
    <>
      {singlePost &&
      <>
      <div className="sharePostPreview">
        <div className="twitterPost">

          <div className="twitterPostAvatar">
            {
              // singlePost.attachedAuthorPicture ? <DynamicMediaProfile attachedMedia={singlePost.attachedAuthorPicture} /> :
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
                  {/* {singlePost.userPost ? (userRegisterData['USERNAME'] || "") : 
                    singleAuthor?.authorName || ""
                  } */}
                  {" "}
                  {/* <span className="twitterPostHeaderSpecial">
                    {singleAuthor?.authorVerified ? <VerifiedUserIcon className="twitterPostBadge" /> : null}
                    {" "} */}
                    {/* twitter handle from registration page */}
                    {/* {singlePost.userPost ? (userRegisterData['HANDLE'] || "") : 
                      singleAuthor?.handle || ""
                    }
                    {" "} */}
                    {/* {singlePost.isReplyTo !== null && singlePost.userPost === true ? "2s" : singlePost.datePosted || ""} */}
                  {/* </span> */}
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
              {/* <Menu
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
                </Menu> */}
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
      }
    </>
  );
}

export default QuoteTweet;