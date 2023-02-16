import "./Post.css";
import { 
  useSelector, 
} from "react-redux";
import { trackLinkClick } from '../../../../../../../services/user-tracking-service';
import { selectSinglePost, selectPostsMetadata } from '../../../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../../../selectors/socialMediaAuthors';
import Text from '../../../../../../Common/UserCommon/SocialMediaPostType/Text';
import { Avatar, Button } from "@material-ui/core";
import { useEffect, useState } from "react";
import Share from '../../../../../../Common/UserCommon/SocialMediaPostType/Share';
import DynamicMedia from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMedia';
import DynamicMediaProfile from '../../../../../../Common/UserCommon/SocialMediaPostType/DynamicMediaProfile';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import InfoIcon from '@material-ui/icons/Info';
import RenderRichTextArea from "../../../../../../Common/UserCommon/RenderRichTextArea";
import SeeWhyModal from "./SeeWhyModal";

const PostTop = ({ id }) => {
  const singlePost = useSelector(state => selectSinglePost(state, id));
  const singleAuthor = useSelector(state => selectSocialMediaAuthor(state, singlePost.authorId));
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const postMetadata = useSelector(state => selectPostsMetadata(state, id));
  const [modalOpen , setModalOpen] = useState(false);
  const [renderSinglePost, setRenderSinglePost] = useState(null);

  function storeLinkClick() {
    const track = {
      action: 'LINKCLICK',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  }

  const openModal = () => {
    setModalOpen(!modalOpen);
    const track = {
      action: 'SEEWHY',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  };

  useEffect(() => {
    setRenderSinglePost(
      <>
        {singlePost &&
          <>
            <div className="postTop">
            {
              // added the posibility to display an author profile image, if no image found, it display a user profile image, and if not found, it will display an mui avatar.
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
            </div>

            <Text postMessage={singlePost.postMessage} link={singlePost.link} />

            {(singlePost.type === 'PHOTO' || singlePost.type === 'VIDEO') &&
              <DynamicMedia
                id={id}
                attachedMedia={singlePost.attachedMedia[0]} 
                warningLabel={singlePost.warningLabel === "OVERPOSTNOTE"}
                labelText={singlePost.labelRichText}
                type={singlePost.type}
                openModal={openModal}
              />
            }

            {singlePost.type === 'LINK' ?
                <div className="link-area">
                  <div className="og-image">
                    <DynamicMedia 
                      id={id}
                      attachedMedia={singlePost.attachedMedia[0]}
                      warningLabel={singlePost.warningLabel === "OVERPOSTNOTE"}
                      labelText={singlePost.labelRichText}
                      type={singlePost.type}
                      postLink={singlePost.link}
                      storeLinkClick={storeLinkClick}
                      openModal={openModal}
                    />
                  </div>
                  <a href={singlePost.link} className="link-preview" onClick={storeLinkClick} target="_blank" rel="noopener noreferrer">
                    <div className="fbPostdescriptions">
                      <div className="og-title">
                        {singlePost.linkTitle}
                      </div>
                      <div className="og-description">
                        {singlePost.linkPreview}
                      </div>
                    </div>
                  </a>

                </div>
              : null}

            {singlePost.type === 'SHARE' ?
              <div className="sharePostPreview">
                <Share id={singlePost.parentPostId} />
              </div>
              : null}

            {singlePost.warningLabel === "FOOTNOTE" &&
              <div className="footNoteLabelMainBox">
                <div className="footNoteLabelTop">
                  <div className="footNoteLabelIcon">
                    <InfoIcon fontSize="small"/>
                  </div>
                  <div>
                  {singlePost?.labelRichText && 
                    <RenderRichTextArea richText={singlePost.labelRichText} inheritFontSize={true}/>
                  }
                  </div>
                </div>
                <Button 
                  className="footNoteLabelBottom"
                  variant="contained"
                  fullWidth
                  onClick={openModal}
                >
                  See Why
                </Button>
              </div>
            }

            {modalOpen && <SeeWhyModal link={singlePost?.checkersLink} setModalOpen={setModalOpen}/>}
          </>}
      </>
    );
  }, [id, postMetadata, modalOpen])

  return (
    <>
      {renderSinglePost ? renderSinglePost : null}
    </>
  );
}

export default PostTop;
