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
  SET_FB_POST_LIKE_NEW,
  SET_FB_READY_STATE
 } from "./types";
import * as MediaPostService from '../services/mediapost-service';
import * as FacebookPostService from '../services/facebook-service';
import Chance from 'chance';

const chance = new Chance();

export const getFacebookPosts = (_id, order) => (dispatch) => {
  return MediaPostService.getMediaPostDetails(_id, order).then(
    (response) => {
      let postRecords = response.data?.data || [];
      console.log('postRecords: ', postRecords);
      // normalize the data
      let normalizedObj = {
        posts: {
          // byId: {

          // },
          // allIds: []
        },
        metaData: {

        }
      };
      let allIds = [];
      for (let i = 0; i < postRecords.length; i++) {
        const eachId = postRecords[i]._id;
        // deconstruct postRecords
        // const { attachedMediaAdmin, ...rest } = postRecords[i];
        normalizedObj.posts[eachId] = { ...postRecords[i], name: chance.name()};
        normalizedObj.metaData[eachId] = {
          like: false,
          actionId: null,
          isAdmin: true,
          comments: []
        };
        allIds.push(eachId);
      }
      // console.log('normalized postRecords: ', normalizedObj);
      // add additional details for likes and commenting
      // fetch media assets and store via post ID's
      // const media = [];
      // store via post ID
      // const nameObj = {};
      // const likes = [];
      // const cooments = {};
      // const post = {};
      // for (let i = 0; i < postRecords.length; i++) {
      //   postRecords[i]['name'] = chance.name();
      //   postRecords[i]['comments'] = [];
      //   postRecords[i]['openComments'] = false;
      //   postRecords[i]['currentComment'] = '';
      //   postRecords[i]['isAdmin'] = true;
        // media.push(postRecords[i].attachedMediaAdmin);
        // delete postRecords[i].attachedMediaAdmin;
        // likes.push(false);
      // }
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
          posts: normalizedObj.posts,
          metaData: normalizedObj.metaData,
          allIds: allIds,
        }
      });

      // dispatch({
      //   type: SET_FB_MEDIA_INITIAL_STATE,
      //   payload: {
      //     media: media,
      //   }
      // });

      // dispatch({
      //   type: SET_FB_READY_STATE,
      //   payload: {
      //     ready: true
      //   }
      // });
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

// export const likeFbPost = (postId) => (dispatch) => {
//   dispatch({
//     type: SET_FB_POST_LIKE,
//     payload: {
//       postId
//     }
//   });
// }

// create a action for specific user with 
// adminPostId, actionType, isAdminPost, userPostId, platformType, comment
export const likeFbPost = (data, id) => (dispatch) => {
  // console.log(data, index);
  return FacebookPostService.createFbAction({ actionObj: data }).then(
    (response) => {
      // this event should render the like transtion on the UI
      dispatch({
        type: SET_FB_POST_LIKE,
        payload: {
          postId: id,
          actionId: response.data._id
        }
      });
      // need to link a likeActionId for unliking a post
      // dispatch({
      //   type: SET_FB_POST_LIKE_ACTION_ID,
      //   payload: {
      //     index,
      //     actionId: 
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


export const unlikeFbPost = (actionId, id) => (dispatch) => {
  return FacebookPostService.deleteFbAction(actionId).then(
    () => {
      // this event should render the unlike transtion on the UI
      dispatch({
        type: SET_FB_POST_UNLIKE,
        payload: {
          postId: id,
        }
      });
      // need to de-link the likeActionId for unliking a post
      // dispatch({
      //   type: NULLIFY_FB_POST_LIKE_ACTION_ID,
      //   payload: {
      //     index
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
// adminPostId, action, userPostId, comment
export const commentFbPost = (data, id) => (dispatch) => {
  return FacebookPostService.createFbAction({ actionObj: data }).then(
    () => {
      dispatch({
        type: SET_FB_POST_COMMENT,
        payload: {
          postId: id,
          comment: data.comment
        }
      });

      // clear the comment
      // dispatch({
      //   type: HANDLE_CHANGE_COMMENT,
      //   payload: {
      //     index,
      //     comment: ""
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
export const shareFbPost = (data) => (dispatch) => {
  return FacebookPostService.shareFbPost({ shareObj: data }).then(
    (response) => {
      // this event should render the new shared post on the UI
      dispatch({
        type: SHARE_FB_POST,
        payload: {
          parentAdminPostId: response.data.parentAdminPostId,
          parentUserPostId: response.data.parentUserPostId,
          shareText: response.data.shareText,
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
export const createFbPost = (data) => (dispatch) => {
  return FacebookPostService.createFbPost(data).then(
    (response) => {
      dispatch({
        type: CREATE_FB_POST,
        payload: {
          type: response.data.type,
          postMessage: response.data.postMessage,
          attachedMediaAdmin: response.data.attachedMediaAdmin, // [{ _id: ..., other media details }]
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
