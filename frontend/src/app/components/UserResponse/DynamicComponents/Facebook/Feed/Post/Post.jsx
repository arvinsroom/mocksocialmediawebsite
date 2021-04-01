import { Avatar, Button } from "@material-ui/core";
import "./Post.css";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import NearMeIcon from '@material-ui/icons/NearMe';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { useEffect, useRef, useState } from "react";
import cloneDeep from 'lodash/cloneDeep';
import { useSelector, useDispatch } from "react-redux";
import { commentFbPost, likeFbPost, unlikeFbPost, toggleCommentBox ,handleFbComment, shareFbPost } from "../../../../../../actions/facebook";
import { showInfoSnackbar } from "../../../../../../actions/snackbar";
import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import Video from './PostType/Video';
import Photo from './PostType/Photo';
import Share from './PostType/Share';
import Link from './PostType/Link';
import Text from './PostType/Text';

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

const Post = () => {
  const { posts: defaultPosts } = useSelector(state => state.facebookPost);
  // const { media } = useSelector(state => state.facebookMedia);
  // const { totalPosts } = useSelector(state => state.facebookTotalPosts);
  // const { likes } = useSelector(state => state.facebookLikes);

  const dispatch = useDispatch();
  const [modalStyle] = useState(getModalStyle);
  const [modalState, setModalState] = useState({
    open: false,
    parentPostIndex: -1,
    sharePostText: ''
  });
  const classes = useStyles();

  const resetShareModal = () => {
    setModalState({
      open: false,
      parentPostIndex: -1,
      sharePostText: ''
    });
  }
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
    setModalState({ ...modalState, 'open': false });
  };

  // adminPostId, action, userPostId, comment
  const handleLike = (adminId, index, e) => {
    e.preventDefault();
    const data = {
      action: 'LIKE',
      comment: null,
      adminPostId: adminId,
      userPostId: null
    };
    dispatch(likeFbPost(data, index));
    // console.log(defaultPosts);
  };

  const handleUnlike = (actionId, index, e) => {
    e.preventDefault();
    dispatch(unlikeFbPost(actionId, index));
    // console.log(defaultPosts);
  };

  const handleSubmitComment = (adminId, comment, index, e) => {
    e.preventDefault();
    const data = {
      action: 'COMMENT',
      comment,
      adminPostId: adminId,
      userPostId: null
    };
    if (comment) dispatch(commentFbPost(data, index));
    else dispatch(showInfoSnackbar("Please type in something!"))
    // console.log(defaultPosts);
  };

  const toggleComment = (index, e) => {
    e.preventDefault();
    dispatch(toggleCommentBox(index));
    // console.log(defaultPosts);
  };

  const handleCommentInput = (index, e) => {
    e.preventDefault();
    dispatch(handleFbComment(index, e.target.value))
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let data = {};
    const prevPost = defaultPosts[modalState.parentPostIndex];
    // const prevPost = singlePost;
    if (prevPost.isAdmin) {
      data['parentUserPostId'] = null;
      data['parentAdminPostId'] = prevPost._id;
      data['shareText'] = modalState.sharePostText;
      dispatch(shareFbPost(data, modalState.parentPostIndex, -1));  
    } else {
      data['parentUserPostId'] = prevPost._id;
      data['parentAdminPostId'] = null;
      data['shareText'] = modalState.sharePostText;
      dispatch(shareFbPost(data, -1, modalState.parentPostIndex));  
    }
    // console.log(defaultPosts);
    resetShareModal();
  }

  // adminPostId, action, userPostId, comment
  // const handleLike2 = (index, e) => {
  //   e.preventDefault();
  //   const data = {
  //     action: 'LIKE',
  //     comment: null,
  //     adminPostId: 'adminId',
  //     userPostId: null
  //   };
  //   dispatch(likeFbPost(data, index));
  // };

  // const handleUnlike2 = (actionId, index, e) => {
  //   e.preventDefault();
    // dispatch(unlikeFbPost(actionId, index));
    // console.log(defaultPosts);
  // };

  // const renderEverything = () => {
  //   if (defaultPosts && defaultPosts.length > 0 && likes && likes.length > 0) {
  //   for(let i = 0; i < totalPosts; i++) {
  //     return (
  //       <>
  //       {<div key={i} className="post">
  //           <div className="postTop">
  //             <Avatar
  //               className="postTopAvatar"
  //             />
  //             <div className="postTopInfo">
  //               <h3>{defaultPosts[i].name}</h3>
  //               <p>{"2h"}</p>
  //             </div>
  //           </div>
  //         </div>}

  //         {defaultPosts[i].postMessage ?
  //           <Text index={i} />
  //         : null}
          
  //         {defaultPosts[i].type === 'PHOTO' ?
  //           <Photo index={i} />
  //         : null}

  //         {defaultPosts[i].type === 'VIDEO' ?
  //           <Video index={i} />
  //         : null}

  //         {defaultPosts[i].type === 'LINK' ?
  //           <Link index={i} />
  //         : null}

  //         <div className="postOptions">
  //           {likes[i].like && <div className="postOption" onClick={e => handleUnlike2()}>
  //             <ThumbUpIcon style={{color: '#1877F2' }} />
  //             <p style={{color: '#1877F2' }}>Like</p>
  //           </div>}
  //           {!likes[i].like && <div className="postOption" onClick={e => handleLike2(i, e)}>
  //             <ThumbUpIcon style={{color: 'grey'}} />
  //             <p style={{color: 'grey'}}>Like</p>
  //           </div>}
  //           <div className="postOption">
  //             <ChatBubbleOutlineIcon />
  //             <p>Comment</p>
  //           </div>
  //           <div className="postOption">
  //             <NearMeIcon />
  //             <p>Share</p>
  //           </div>
  //           <div className="postOption" >
  //             <AccountCircleIcon />
  //             <ExpandMoreIcon />
  //           </div>
  //         </div>

  //       </>
  //     );
  //   }
  // }
  // };

  return (
    <>
      {defaultPosts?.length > 0 ? defaultPosts.map((singlePost, index) => (
        <>
        <div key={index} className="post">
          <div className="postTop">
            <Avatar
              // src={profilePic}
              className="postTopAvatar"
            />
            <div className="postTopInfo">
              <h3>{singlePost.name}</h3>
              <p>{"2h"}</p>
            </div>
          </div>

        
          {singlePost && singlePost.postMessage ?
            <Text index={index} />
          : null}
          
          {singlePost.type === 'PHOTO' ?
            <Photo index={index} />
          : null}

          {singlePost.type === 'VIDEO' ?
            <Video index={index} />
          : null}

          {singlePost.type === 'LINK' ?
            <Link index={index} />
          : null}

          {singlePost.type === 'SHARE' ? 
            <>
              {(singlePost.parentUserPostIndex !== -1) && <Share parentIndex={singlePost.parentUserPostIndex} />}
              {(singlePost.parentAdminPostIndex !== -1) && <Share parentIndex={singlePost.parentAdminPostIndex} />}
            </>
          : null}


          <div className="postOptions">
            {singlePost.like && <div className="postOption" onClick={e => handleUnlike(singlePost.actionId, index, e)}>
              <ThumbUpIcon style={{color: '#1877F2' }} />
              <p style={{color: '#1877F2' }}>Like</p>
            </div>}
            {!singlePost.like && <div className="postOption" onClick={e => handleLike(singlePost._id, index, e)}>
              <ThumbUpIcon style={{color: 'grey'}} />
              <p style={{color: 'grey'}}>Like</p>
            </div>}
            <div className="postOption" onClick={e => toggleComment(index, e)}>
              <ChatBubbleOutlineIcon />
              <p>Comment</p>
            </div>
            <div className="postOption" onClick={({ target }) => setModalState({ ...modalState, 'parentPostIndex': index, 'open': true })}>
              <NearMeIcon />
              <p>Share</p>
            </div>
            <div className="postOption" >
              <AccountCircleIcon />
              <ExpandMoreIcon />
            </div>
          </div>

          {singlePost.openComments && 
          <div className="comment">
            <div className="createComment">
              <Avatar />
              <form>
                <input
                value={singlePost.currentComment}
                onChange={e => handleCommentInput(index, e)}
                className="createCommentInputText"
                type="text"
                placeholder="Write a comment..." />

                <button className="postComment" onClick={e => handleSubmitComment(singlePost._id, singlePost.currentComment, index, e)} type="submit">
                  Post
                </button>
              </form>
            </div>

              {singlePost.comments?.length > 0 ? singlePost.comments.map((comment, idx) => (
                <div key={idx} className="showComment">
                  <Avatar />
                  <p className="displayIndividualComment">{comment}</p>
                </div>
              ))
              : null}

          </div>}
        </div> 

      <div>
        <Modal
          open={modalState.open}
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
                  value={modalState.sharePostText}
                  onChange={({ target }) => setModalState({ ...modalState, 'sharePostText': target.value })}
                  className="createCommentInputText"
                  type="text"
                  placeholder="What's on your mind?" />
             </div>

            {modalState.parentPostIndex !== -1 && defaultPosts[modalState.parentPostIndex] ?
              <p id="simple-modal-description">
                {defaultPosts[modalState.parentPostIndex].postMessage ?
                  <Text index={modalState.parentPostIndex} />
                : null}

                {defaultPosts[modalState.parentPostIndex].type === 'PHOTO' ?
                  <Photo index={modalState.parentPostIndex} />
                : null}

                {defaultPosts[modalState.parentPostIndex].type === 'VIDEO' ? 
                  <Video index={modalState.parentPostIndex} />
                : null}

                {defaultPosts[modalState.parentPostIndex].type === 'LINK' ?
                  <Link index={modalState.parentPostIndex} />
                : null}
              </p>
            : null}
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
      </div>
      </>
      )): null}
    </>
  );
}

export default Post;