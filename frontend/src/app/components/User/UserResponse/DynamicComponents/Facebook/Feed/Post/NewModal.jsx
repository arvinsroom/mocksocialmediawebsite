import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import { createFbPost } from '../../../../../../../actions/facebook';
import { useState } from "react";
import { Avatar, Container } from "@material-ui/core";
import { showInfoSnackbar, showSuccessSnackbar } from '../../../../../../../actions/snackbar';
import Modal from '@material-ui/core/Modal';
import { Button, Input } from "@material-ui/core";
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ClearIcon from '@material-ui/icons/Clear';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import RoomIcon from '@material-ui/icons/Room';
import GifIcon from '@material-ui/icons/Gif';
import { FB_TRANSLATIONS_DEFAULT, USER_TRANSLATIONS_DEFAULT } from '../../../../../../../constants';

const NewModal = ({ setModalOpen }) => {
  const fbTranslations = useSelector(state => state.facebook.fbTranslations);
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const { translations } = useSelector(state => state.userAuth);

  const [avatar, setAvatar] = useState(null);
  const [videoAvatar, setVideoAvatar] = useState(null);
  const [type, setType] = useState("TEXT");
  const pageId = useSelector(state => state.facebook.pageId);

  const [file, setFile] = useState(null);
  const [postMessage, setPostMessage] = useState("");

  const dispatch = useDispatch();

  const handleClose = () => {
    setModalOpen(false)
  };

  const handleDelete = async (e) => {
    e.preventDefault();

    await setVideoAvatar(null);
    await setAvatar(null);
    await setFile(null);
    await setType("TEXT");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // create formdata for select image or video
    if (!file && !postMessage) {
      dispatch(showSuccessSnackbar(translations?.please_enter_a_valid_response || USER_TRANSLATIONS_DEFAULT.PLEASE_ENTER_A_VALID_RESPONSE));
    } else {
      const totalFileSize = file?.size || 0;
      // less than 20 MB
      if (totalFileSize <= 20e6) {
        const postObj = {
          postMessage: postMessage || null,
          type: type,
          pageId,
        };  
        let formData = new FormData();
        formData.append("file", file || null);
        formData.append("postObj", JSON.stringify(postObj));
        await dispatch(createFbPost(formData));
        await dispatch(showSuccessSnackbar(translations?.['posted!'] || USER_TRANSLATIONS_DEFAULT?.POSTED))
        setModalOpen(false);
      } else {
        dispatch(showInfoSnackbar(translations?.please_upload_file_of_size_less_than_20mb || USER_TRANSLATIONS_DEFAULT?.PLEASE_UPLOAD_FILE_OF_SIZE_LESS_THAN_20MB));
      }
    }
  }

  const onImageChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      await setFile(selectedFile);
      if (selectedFile.type.includes('video')) {
        await setType('VIDEO');
        await setVideoAvatar(URL.createObjectURL(selectedFile))
      } else {
        await setType('PHOTO');
        await setAvatar(URL.createObjectURL(selectedFile));
      }
    }
  }

  return (
      <Modal
        open={true}
        disableAutoFocus={true}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {
          <Container component="main" className="modalContainer" maxWidth="sm">
          <div className="modalContainerPaper">
            <form onSubmit={handleSubmit}>
              <div className="modalTop">
                <h2 className="modalTopFont">{fbTranslations?.create_post || FB_TRANSLATIONS_DEFAULT.CREATE_POST}</h2>
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
                  value={postMessage}
                  autoFocus={true}
                  onChange={({ target }) => setPostMessage(target.value)}
                  className="newFeedInputArea"
                  type="text"
                  // placeholder={`What's on your mind, ${userName.split(' ')[0]}?`} />
                  placeholder={fbTranslations?.["what's_on_your_mind?"] || FB_TRANSLATIONS_DEFAULT.WHATS_ON_YOUR_MIND} />
              </div>

              {avatar &&
                <div className="container sharePreview sharePostPreview">
                  <img src={avatar} alt="upload pic" className="selectedFile" />
                  <ClearIcon className="btn" onClick={e => handleDelete(e)} />
                </div>}
              {videoAvatar &&
                <div className="container sharePreview sharePostPreview">
                  <video src={videoAvatar} className="selectedFile" />
                  <ClearIcon className="btn" onClick={e => handleDelete(e)} />
                </div>}

              <div className="newModalBottom">
                <div className="newModalOption newModalWidth1">
                  <p>{fbTranslations?.add_to_your_post || FB_TRANSLATIONS_DEFAULT.ADD_TO_YOUR_POST}</p>
                </div>
                <div className="newModalWidth2">
                  <div className="newModalOption">
                    <label htmlFor="upload-photo">
                      <Input
                        style={{ display: "none" }}
                        id="upload-photo"
                        type="file"
                        inputProps={{ multiple: false }}
                        accept="image/*, video/*"
                        onChange={(e) => onImageChange(e)}
                      />
                      <PhotoLibraryIcon style={{ color: '#31A24C' }}/>
                    </label>
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
                    <GifIcon style={{ color: '#6BCEBB' }} />
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
                {fbTranslations?.post || FB_TRANSLATIONS_DEFAULT.POST}
              </Button>
            </form>
          </div>
          </Container>
        }
      </Modal>
  );
};

export default NewModal;