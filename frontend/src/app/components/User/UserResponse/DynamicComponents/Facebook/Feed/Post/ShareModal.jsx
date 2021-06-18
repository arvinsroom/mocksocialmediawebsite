import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import { createFbPost } from '../../../../../../../actions/socialMedia';
import { useState } from "react";
import { Avatar, Container } from "@material-ui/core";
import { showSuccessSnackbar } from '../../../../../../../actions/snackbar';
import Modal from '@material-ui/core/Modal';
import { Button } from "@material-ui/core";
import Share from '../../../../../../Common/UserCommon/SocialMediaPostType/Share';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ClearIcon from '@material-ui/icons/Clear';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import RoomIcon from '@material-ui/icons/Room';
import GifIcon from '@material-ui/icons/Gif';
import { FB_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';

const ShareModal = ({ id, setModalOpen }) => {
  const fbTranslations = useSelector(state => state.socialMedia.fbTranslations);
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const { translations } = useSelector(state => state.userAuth);

  const [sharePostText, setSharePostText] = useState("");
  const dispatch = useDispatch();
  // const userName = useSelector(state => state.socialMedia.name);
  const pageId = useSelector(state => state.socialMedia.pageId);

  const handleClose = () => {
    setModalOpen(false)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // create formdata for select image or video
    const postObj = {
      postMessage: sharePostText || null,
      parentPostId: id,
      type: 'SHARE',
      pageId
    };
    
    await dispatch(createFbPost({ postObj: JSON.stringify(postObj) }));
    await dispatch(showSuccessSnackbar(translations?.['posted!'] || USER_TRANSLATIONS_DEFAULT?.POSTED));
    // clear state
    setSharePostText("");
    setModalOpen(false);
  }

  return (
    <Modal
      open={true}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {
        <Container component="main" className="modalContainerShare" maxWidth="sm">
          <div className="modalContainerPaper">
          <form onSubmit={handleSubmit}>
            <div className="modalTop">
              <h2 className="modalTopFont">{fbTranslations?.write_post || FB_TRANSLATIONS_DEFAULT.WRITE_POST}</h2>
              <div className="modalTopBtn">
                <ClearIcon className="btn" onClick={handleClose} />
              </div>
            </div>

            <div className="postTop">
              <Avatar
                src={userRegisterData['PROFILEPHOTO'] || ""}
                className="postTopAvatar"
              />
              <div className="postTopInfo">
                <h3>{userRegisterData['USERNAME'] || ""}</h3>
                {/*<p>{"2h"}</p> */}
              </div>
            </div>

            <div className="createComment">
              <textarea
                value={sharePostText}
                autoFocus={true}
                onChange={({ target }) => setSharePostText(target.value)}
                className="newFeedInputAreaShare"
                type="text"
                // placeholder={`What's on your mind, ${userName.split(' ')[0]}?`} />
                placeholder={fbTranslations?.["what's_on_your_mind?"] || FB_TRANSLATIONS_DEFAULT.WHATS_ON_YOUR_MIND} />
            </div>

            <div className="sharePreview sharePostPreview">
              <Share id={id} />
            </div>

            <div className="newModalBottom">
                <div className="newModalOption newModalWidth1">
                  <p>{fbTranslations?.add_to_your_post || FB_TRANSLATIONS_DEFAULT.ADD_TO_YOUR_POST}</p>
                </div>
                <div className="newModalWidth2">
                  <div className="newModalOption">
                    <PhotoLibraryIcon color='disabled' />
                  </div>
                  <div className="newModalOption">
                    <PersonAddIcon style={{ color: '#1877F2' }}/>
                  </div>
                  <div className="newModalOption">
                    <InsertEmoticonIcon style={{ color: '#F5C33B' }} />
                  </div>
                  <div className="newModalOption">
                    <RoomIcon style={{ color: '#FA383E' }} />
                  </div>
                  <div className="newModalOption">
                    <GifIcon color='disabled' />
                  </div>
                  <div className="newModalOption">
                    <MoreHorizIcon />
                  </div>
                </div>
            </div>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
            >
              {fbTranslations?.share || FB_TRANSLATIONS_DEFAULT.SHARE}
            </Button>
          </form>
        </div>
        </Container>
      }
    </Modal>
  );
};

export default ShareModal;