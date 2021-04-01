import "./StoryCreate.css";
import { Avatar } from "@material-ui/core";
import VideocamIcon from '@material-ui/icons/Videocam';
import PhotoLibraryIcon from '@material-ui/icons/PhotoLibrary';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';

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

const StoryCreate = () => {
  // const [input, setInput] = useState('');
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const classes = useStyles();
  const { posts } = useSelector(state => state.facebookPost);


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
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   // db stuff
  //   setInput("");
  // }

  // const handleInput = (e) => {
  //   e.preventDefault();

  //   setInput(e.target.value);
  // }

  return (
    <>
    <div className="storyCreate">
      <div className="storyCreateTop">
        <Avatar />
        <form>
          <input
          // value={input}
          onClick={handleOpen}
          className="createStoryInputText"
          type="text"
          placeholder="What's on your mind?" />

          {/* <button hidden={true} onClick={handleSubmit} type="submit">
            Hidden submit
          </button> */}
        </form>
      </div>

      <div className="storyCreateBottom">
        <div className="storyCreateOption">
          <VideocamIcon style={{ color: "red" }} />
          <h3>Live Video</h3>
        </div>
        <div className="storyCreateOption">
          <PhotoLibraryIcon style={{ color: "green" }} />
          <h3>Photo/Video</h3>
        </div>
        <div className="storyCreateOption">
          <InsertEmoticonIcon style={{ color: "orange" }} />
          <h3>Feeling/Activity</h3>
        </div>
      </div>
    </div>
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        {
          <div style={modalStyle} className={classes.paper}>
            <h2 id="simple-modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>
          </div>
        }
      </Modal>
      </div>
    </>
  );
}

export default StoryCreate;