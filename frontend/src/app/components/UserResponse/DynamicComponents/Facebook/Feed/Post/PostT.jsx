import "./Post.css";
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import NearMeIcon from '@material-ui/icons/NearMe';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import cloneDeep from 'lodash/cloneDeep';
import { useSelector, useDispatch } from "react-redux";
import { likeFbPost } from "../../../../../../actions/facebook";
import { createCachedSelector } from 're-reselect';
import { selectSubItems, selectAllLikes } from '../../../../../../reducers/facebook';
import Photo from './PostType/Photo';
import Video from './PostType/Video';
import Link from './PostType/Link';
import Text from './PostType/Text';
import { Avatar } from "@material-ui/core";
import { useEffect, useState } from "react";
import Share from './PostType/Share';

// const selectUsers = state => state.facebookPost.posts;
// const selectUserId = (state, postId) => postId;

// const selectEachPost = createCachedSelector(
//     [selectUsers, selectUserId],
//     (posts, postId) =>  {
//       return posts[postId];
//     }
// )(
//   (state, post) => post
// );

const PostT = ({ id }) => {
  const singlePost = useSelector(state => selectSubItems(state, id));
  // const like = useSelector(state => selectAllLikes(state, id));
  // const singlePost = useSelector(state => selectSubItems(state, id));

  // const dispatch = useDispatch();
  // adminPostId, action, userPostId, comment
  // const handleLike = (id, e) => {
  //   console.log('handleLike');
  //   e.preventDefault();
  //   dispatch(likeFbPost(id));
  // };
  const [ss, setSs] = useState(null);
  console.log(singlePost);
  useEffect(() => {
    setSs(
      <>
      {singlePost && 
          <>
            <div className="postTop">
            {console.log('inside PostT!')}
              <Avatar
              className="postTopAvatar"
              />
              <div className="postTopInfo">
                <h3>{singlePost.name}</h3>
                <p>{"2h"}</p>
              </div>
            </div>
  
            <Text postMessage={singlePost.postMessage} link={singlePost.link}/>
  
            {singlePost.type === 'PHOTO' ?
               <Photo attachedMedia={singlePost.attachedMediaAdmin[0]} />
            : null}
  
            {singlePost.type === 'VIDEO' ?
               <Video attachedMedia={singlePost.attachedMediaAdmin[0]} />
             : null}
  
            {singlePost.type === 'LINK' ?
              <a href={singlePost.link} className="link-preview" target="_blank" rel="noopener noreferrer">
                <div className="link-area">
                  <div className="og-image">
                    <Photo attachedMedia={singlePost.attachedMediaAdmin[0]} />
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

            {singlePost.type === 'SHARE' ?
               <Share id={singlePost.parentAdminPostId || singlePost.parentUserPostId} />
            : null}
      </>}
      </>  
    );
  }, [id])

  return (

    <>
          {ss ? ss : null}

  </>
  );
}

export default PostT;
