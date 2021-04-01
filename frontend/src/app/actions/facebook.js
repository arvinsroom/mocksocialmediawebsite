import {
  SET_FB_INITIAL_STATE,
  SET_FB_POST_LIKE,
  SET_FB_POST_UNLIKE,
  SNACKBAR_ERROR,
  SET_FB_POST_LIKE_ACTION_ID,
  NULLIFY_FB_POST_LIKE_ACTION_ID,
  SET_FB_POST_COMMENT,
  CREATE_FB_POST,
  TOGGLE_COMMENT_BOX,
  HANDLE_CHANGE_COMMENT,
  SHARE_FB_POST,
  SET_FB_MEDIA_INITIAL_STATE,
  SET_FB_LIKES_INITIAL_STATE,
  SET_FB_TOTAL_INITIAL_STATE,
  SET_FB_POST_LIKE_NEW
 } from "./types";
import * as MediaPostService from '../services/mediapost-service';
import * as FacebookPostService from '../services/facebook-service';
import Chance from 'chance';

const chance = new Chance();

export const getFacebookPosts = (_id) => (dispatch) => {
  return MediaPostService.getMediaPostDetails(_id).then(
    (response) => {
      let postRecords = response.data?.data || [];
      // add additional details for likes and commenting
      // fetch media assets and store via post ID's
      const media = [];
      // store via post ID
      // const nameObj = {};
      // const likes = [];
      // const cooments = {};
      // const post = {};
      for (let i = 0; i < postRecords.length; i++) {
        postRecords[i]['name'] = chance.name();
        postRecords[i]['comments'] = [];
        postRecords[i]['openComments'] = false;
        postRecords[i]['currentComment'] = '';
        postRecords[i]['isAdmin'] = true;
        media.push(postRecords[i].attachedMediaAdmin);
        delete postRecords[i].attachedMediaAdmin;
        // likes.push(false);
      }
      // console.log('posts: ', postRecords);
      // console.log('media: ', media);
      // console.log('likes: ', likes);
      // console.log('postRecords.length: ', postRecords.length);

      // dispatch({
      //   type: SET_FB_TOTAL_INITIAL_STATE,
      //   payload: {
      //     totalPosts: postRecords.length
      //   }
      // });

      dispatch({
        type: SET_FB_INITIAL_STATE,
        payload: {
          posts: postRecords,
        }
      });

      dispatch({
        type: SET_FB_MEDIA_INITIAL_STATE,
        payload: {
          media: media
        }
      });

      // dispatch({
      //   type: SET_FB_LIKES_INITIAL_STATE,
      //   payload: {
      //     likes: likes
      //   }
      // });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SNACKBAR_ERROR,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

// create a action for specific user with 
// adminPostId, actionType, isAdminPost, userPostId, platformType, comment
export const likeFbPost = (data, index) => (dispatch) => {
  console.log(data, index);
  return FacebookPostService.createFbAction({actionObj: data}).then(
    (response) => {
      // this event should render the like transtion on the UI
      dispatch({
        type: SET_FB_POST_LIKE,
        payload: {
          index
        }
      });
      // need to link a likeActionId for unliking a post
      dispatch({
        type: SET_FB_POST_LIKE_ACTION_ID,
        payload: {
          index,
          actionId: response.data._id
        }
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SNACKBAR_ERROR,
        payload: message,
      });

      return Promise.reject();
    }
  );
};


export const unlikeFbPost = (likeActionId, index) => (dispatch) => {
  return FacebookPostService.deleteFbAction(likeActionId).then(
    () => {
      // this event should render the unlike transtion on the UI
      dispatch({
        type: SET_FB_POST_UNLIKE,
        payload: {
          index
        }
      });
      // need to de-link the likeActionId for unliking a post
      dispatch({
        type: NULLIFY_FB_POST_LIKE_ACTION_ID,
        payload: {
          index
        }
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SNACKBAR_ERROR,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

// create a action for specific user with 
// adminPostId, action, userPostId, comment
export const commentFbPost = (data, index) => (dispatch) => {
  return FacebookPostService.createFbAction({ actionObj: data}).then(
    () => {
      dispatch({
        type: SET_FB_POST_COMMENT,
        payload: {
          index,
          comment: data.comment
        }
      });

      // clear the comment
      dispatch({
        type: HANDLE_CHANGE_COMMENT,
        payload: {
          index,
          comment: ""
        }
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SNACKBAR_ERROR,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const toggleCommentBox = (index) => ({
  type: TOGGLE_COMMENT_BOX,
  payload: {
    index
  }
});

export const handleFbComment = (index, comment) => ({
  type: HANDLE_CHANGE_COMMENT,
  payload: {
    index,
    comment
  }
});

// shareText, parentAdminPostId, parentUserPostId
export const shareFbPost = (data, parentAdminPostIndex, parentUserPostIndex) => (dispatch) => {
  return FacebookPostService.shareFbPost({ shareObj: data }).then(
    (response) => {
      // this event should render the new shared post on the UI
      dispatch({
        type: SHARE_FB_POST,
        payload: {
          parentAdminPostIndex: parentAdminPostIndex,
          parentUserPostIndex: parentUserPostIndex,
          shareText: data.shareText,
          _id: response.data._id
        }
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SNACKBAR_ERROR,
        payload: message,
      });

      return Promise.reject();
    }
  );
};



// media can use multer for sending a image or video file
// entry for user post, type (text, photo, video), postMessage, link, linkTitle, linkPreview, media
// export const createFbPost = (data) => (dispatch) => {
//   return FacebookPostService.createFbPost(data).then(
//     () => {
//       dispatch({
//         type: CREATE_FB_POST,
//         payload: {
//           newPost: data
//         }
//       });

//       return Promise.resolve();
//     },
//     (error) => {
//       const message =
//         (error.response &&
//           error.response.data &&
//           error.response.data.message) ||
//         error.message ||
//         error.toString();

//       dispatch({
//         type: SNACKBAR_ERROR,
//         payload: message,
//       });

//       return Promise.reject();
//     }
//   );
// };
