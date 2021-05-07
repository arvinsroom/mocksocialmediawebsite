import "./Post.css";
import { useDispatch, useSelector } from "react-redux";
import { createFbPost } from "../../../../../../actions/facebook";
import { useState, useRef } from "react";
import { Avatar, Container } from "@material-ui/core";
import { showSuccessSnackbar } from "../../../../../../actions/snackbar";
import Modal from '@material-ui/core/Modal';
import { Button, Input } from "@material-ui/core";
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ClearIcon from '@material-ui/icons/Clear';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import RoomIcon from '@material-ui/icons/Room';
import GifIcon from '@material-ui/icons/Gif';
import { FB_TRANSLATIONS_DEFAULT } from '../../../../../../constants';

const NewModal = ({ setModalOpen }) => {
  const fbTranslations = useSelector(state => state.facebookPost.fbTranslations);
  const [avatar, setAvatar] = useState(null);
  const [videoAvatar, setVideoAvatar] = useState(null);
  const [type, setType] = useState("TEXT");
  // const userName = useSelector(state => state.facebookPost.name);
  const pageId = useSelector(state => state.facebookPost.pageId);

  const [file, setFile] = useState(null);
  // const [modalStyle] = useState(getModalStyle);
  const [postMessage, setPostMessage] = useState("");
  const fileRef = useRef(null);

  const dispatch = useDispatch();

  const handleClose = () => {
    setModalOpen(false)
  };

  const handleDelete = () => {
    setVideoAvatar(null);
    setAvatar(null);
    setFile(null);
    setType("TEXT");
    fileRef.current.src = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // create formdata for select image or video
    if (!file && !postMessage) {
      dispatch(showSuccessSnackbar("Please enter a valid response!"));
    } else {
      const postObj = {
        postMessage: postMessage || null,
        type: type,
        pageId,
      };
      let formData = new FormData();
      formData.append("file", file || null);
      formData.append("postObj", JSON.stringify(postObj));
      dispatch(createFbPost(formData));
      dispatch(showSuccessSnackbar("Post successfully created"));
      setModalOpen(false);
    }
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setVideoAvatar(null);
      setAvatar(null);
      setFile(event.target.files[0]);
      if (event.target.files[0].type.includes('video')) {
        setType('VIDEO');
        setVideoAvatar(URL.createObjectURL(event.target.files[0]))
      } else {
        setAvatar(URL.createObjectURL(event.target.files[0]));
        setType('PHOTO');
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
                  className="postTopAvatar"
                />
                <div className="postTopInfo">
                  {/* <h3>{userName}</h3>
                  <p>{"2h"}</p> */}
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
                  placeholder={fbTranslations?.["what's_on_your_mind"] || FB_TRANSLATIONS_DEFAULT.WHATS_ON_YOUR_MIND} />
              </div>

              {avatar &&
                <div className="container sharePreview">
                  <img src={avatar} alt="upload pic" className="selectedFile" />
                  <ClearIcon className="btn" onClick={handleDelete} />
                </div>}
              {videoAvatar &&
                <div className="container sharePreview">
                  <video src={videoAvatar} className="selectedFile" />
                  <ClearIcon className="btn" onClick={handleDelete} />
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
                        ref={fileRef}
                        inputProps={{ multiple: false }}
                        accept="image/*, video/*"
                        onChange={onImageChange}
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