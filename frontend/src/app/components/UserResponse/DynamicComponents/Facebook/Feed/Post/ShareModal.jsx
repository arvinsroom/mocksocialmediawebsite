import "./Post.css";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import NearMeIcon from '@material-ui/icons/NearMe';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useSelector, useDispatch } from "react-redux";
import { shareFbPost } from "../../../../../../actions/facebook";
import { selectAllLikes } from '../../../../../../reducers/facebook';
import { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import { showSuccessSnackbar } from "../../../../../../actions/snackbar";
import { selectSubItems } from '../../../../../../reducers/facebook';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import PostT from './PostT';
import { Button } from "@material-ui/core";
import Share from './PostType/Share';
import { shallowEqual } from "react-redux";

const ShareModal = ({ id, isAdmin, setModalOpen }) => {
  // select parentPost from cache 
  // const parentPost = useSelector(state => selectSubItems(state, parentPostId));
  const parentSharedPost = useSelector(state => state.facebookPost.posts[id], shallowEqual);
  const [renderOnce, setRenderOnce] = useState(false);
  
  const [modalStyle] = useState(getModalStyle);
  const [sharePostText, setSharePostText] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {};
    data['parentUserPostId'] = isAdmin ? null : id;
    data['parentAdminPostId'] = isAdmin ? id : null;
    data['shareText'] = sharePostText;
    dispatch(shareFbPost(data));
    setModalOpen(false);
    dispatch(showSuccessSnackbar("Post Sucessfully shared"));
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
                  value={sharePostText}
                  onChange={({ target }) => setSharePostText(target.value)}
                  className="createCommentInputText"
                  type="text"
                  placeholder="What's on your mind?" />
             </div>
            
             <Share id={id}/>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submit}
            >
              Share
            </Button>
            </form>
          </div>
        }
        </Modal>

  );
};

// const ShareModal = ({ id, isAdmin, setModalOpen }) => {
//   const [ss, setSs] = useState(null);
//   useEffect(() => {
//     setSs(<ShareM id={id} isAdmin={isAdmin} setModalOpen={setModalOpen} />);
//   }, [id])

//   return (
//     <>
//       {ss ? ss : null}
//     </>
//   );
// };

export default ShareModal;