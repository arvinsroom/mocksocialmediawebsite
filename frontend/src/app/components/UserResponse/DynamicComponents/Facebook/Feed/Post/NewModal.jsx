import "./Post.css";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import NearMeIcon from '@material-ui/icons/NearMe';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useSelector, useDispatch } from "react-redux";
import { createFbPost } from "../../../../../../actions/facebook";
import { useEffect, useState, useRef } from "react";
import { Avatar } from "@material-ui/core";
import { showSuccessSnackbar } from "../../../../../../actions/snackbar";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button, Input, Fab } from "@material-ui/core";
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import ClearIcon from '@material-ui/icons/Clear';

const NewModal = ({ setModalOpen }) => {
  // select parentPost from cache 
  // const parentPost = useSelector(state => selectSubItems(state, parentPostId));
  const [avatar, setAvatar] = useState(null);
  const [videoAvatar, setVideoAvatar] = useState(null);

  const [file, setFile] = useState(null);
  const [modalStyle] = useState(getModalStyle);
  const [postMessage, setPostMessage] = useState("");
  const fileRef = useRef(null);

  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  const classes = useStyles();
  const dispatch = useDispatch();
  
  function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

  const handleClose = () => {
    setModalOpen(false)
  };

  const handleDelete = () => {
    setVideoAvatar(null);
    setAvatar(null);
    setFile(null);
    fileRef.current.src = null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // create formdata for select image or video
    let formData = new FormData();
    formData.append("file", file || null);
    formData.append("postMessage", postMessage || null);
    dispatch(createFbPost(formData));
    dispatch(showSuccessSnackbar("Post Sucessfully created"));
    setModalOpen(false);
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setVideoAvatar(null);
      setAvatar(null);
      setFile(event.target.files[0]);
      if (event.target.files[0].type.includes('video')) {
        setVideoAvatar(URL.createObjectURL(event.target.files[0]))
      } else setAvatar(URL.createObjectURL(event.target.files[0]));
    }
  }

  return (
      <Modal
          open={true}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {
            <div style={modalStyle} className={classes.paper}>
              <form onSubmit={handleSubmit}>
              <h2 id="simple-modal-title">Write Post</h2>
              <div className="createComment">
                <Avatar />
                  <input
                  value={postMessage}
                  onChange={({ target }) => setPostMessage(target.value)}
                  className="createCommentInputText"
                  type="text"
                  placeholder="What's on your mind?" />
             </div>

             {avatar && 
             <div className="container">
                <img src={avatar} alt="upload pic" className="selectedFile"/>
                <ClearIcon className="btn" onClick={handleDelete}/>
              </div>}
             {videoAvatar && 
              <div className="container">
                <video src={videoAvatar} className="selectedFile"/>
                <ClearIcon className="btn" onClick={handleDelete}/>
              </div>}
              
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
                <PhotoLibraryIcon />
            </label>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
            >
              Post
            </Button>
            </form>
          </div>
        }
        </Modal>

  );
};

export default NewModal;