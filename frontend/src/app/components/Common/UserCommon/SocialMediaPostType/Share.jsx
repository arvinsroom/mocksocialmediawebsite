import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DynamicMedia from './DynamicMedia';
import Text from './Text';
import { Avatar, Button } from "@material-ui/core";
import { selectSinglePost } from '../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../selectors/socialMediaAuthors';
import DynamicMediaProfile from './DynamicMediaProfile';
import SeeWhyModal from "../../../User/UserResponse/DynamicComponents/Facebook/Feed/Post/SeeWhyModal";
import RenderRichTextArea from "../RenderRichTextArea";
import InfoIcon from '@material-ui/icons/Info';
import { trackUserClick } from "../../../../actions/userTracking";
import "./Share.css";

// Used for only Facebook share
const Share = ({ id }) => {
  const parentSharedPost = useSelector(state => selectSinglePost(state, id));
  const singleAuthor = useSelector(state => selectSocialMediaAuthor(state, parentSharedPost.authorId));
  const [renderSharePost, setRenderSharePost] = useState(null);
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(parentSharedPost.warningLabel === "OVERPOSTNOTE" ? false : true);

  const dispatch = useDispatch();

  function storeLinkClick() {
    if (activeLink) {
      const track = {
        action: 'LINKCLICK',
        userPostId: id
      };
      dispatch(trackUserClick(track));
    }
  }

  const openModal = (e) => {
    e.preventDefault();
    setModalOpen(!modalOpen);
    const track = {
      action: 'SEEWHY',
      userPostId: id
    };
    dispatch(trackUserClick(track));
  };

  const activateLink = (e) => {
    e.preventDefault();
    setActiveLink(true);
  };

  useEffect(() => {
    if (parentSharedPost) {
      setRenderSharePost(
        <div className="post">
          <div className="postTop">
            {
              parentSharedPost.attachedAuthorPicture ? 
                <DynamicMediaProfile attachedMedia={parentSharedPost.attachedAuthorPicture} customCSS="fbAuthorProfileImage" /> :
                <Avatar
                  src={parentSharedPost.userPost ? (userRegisterData['PROFILEPHOTO'] || "") : ""}
                  className="fbPostTopAvatar"
                />
            }
            <div className="postTopInfo">
            <h3>{parentSharedPost.userPost ? (userRegisterData['USERNAME'] || "") : 
              (singleAuthor?.authorName || "")
            }</h3>
            <p>{parentSharedPost.datePosted || ""}</p>
            </div>
          </div>

          <Text className="postMessage" postMessage={parentSharedPost.postMessage} link={parentSharedPost.link} />

          {(parentSharedPost.type === 'PHOTO' || parentSharedPost.type === 'VIDEO') &&
            <DynamicMedia 
              id={id}
              attachedMedia={parentSharedPost.attachedMedia[0]} 
              warningLabel={parentSharedPost.warningLabel === "OVERPOSTNOTE"}
              labelText={parentSharedPost.labelRichText}
              type={parentSharedPost.type}
              openModal={openModal}
            />
          }

          {parentSharedPost.type === 'LINK' ?
            <a href={activeLink ? parentSharedPost.link : undefined} className="link-preview" onClick={storeLinkClick} target="_blank" rel="noopener noreferrer">
              <div className="link-area">
                <div className="og-image">
                  <DynamicMedia 
                    id={id}
                    attachedMedia={parentSharedPost.attachedMedia[0]}
                    warningLabel={parentSharedPost.warningLabel === "OVERPOSTNOTE"}
                    labelText={parentSharedPost.labelRichText}
                    type={parentSharedPost.type}
                    openModal={openModal}
                    activateLink={activateLink}
                  />
                </div>
                <div className="fbSharedescriptions">
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

            {parentSharedPost.warningLabel === "FOOTNOTE" &&
              <div className="footNoteLabelMainBox">
                <div className="footNoteLabelTop">
                  <div className="footNoteLabelIcon">
                    <InfoIcon fontSize="small"/>
                  </div>
                  <div>
                  {parentSharedPost?.labelRichText && 
                    <RenderRichTextArea richText={parentSharedPost.labelRichText} inheritFontSize={true}/>
                  }
                  </div>
                </div>
                <Button 
                  className="footNoteLabelBottom"
                  variant="contained"
                  fullWidth
                  onClick={e => openModal(e)}
                >
                  See Why
                </Button>
              </div>
            }
          {modalOpen && <SeeWhyModal link={parentSharedPost?.checkersLink} setModalOpen={setModalOpen}/>}
        </div>
      );
    }
  }, [id, modalOpen, activeLink])

  return (
    <>
      {renderSharePost ? renderSharePost : null}
    </>
  );
}

export default Share;