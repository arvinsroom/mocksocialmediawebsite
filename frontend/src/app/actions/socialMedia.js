import {
  STACK_FB_STATE,
  SET_FB_POST_LIKE,
  SET_FB_POST_UNLIKE,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  SET_FB_POST_COMMENT,
  CREATE_FB_POST,
  SET_FB_LOADING,
  SET_FB_POST_IDS_AND_COUNT,
  SET_FB_POST_FETCH_FINISH,
  UPDATE_FACEBOOK_PAGE_STATE,
  CLEAR_FB_STATE
 } from "./types";
import * as FacebookPostService from '../services/facebook-service';

export const finishFetch = () => (dispatch) => {
  dispatch({
    type: SET_FB_POST_FETCH_FINISH,
  });
};

export const clearFacebookState = () => (dispatch) => {
  dispatch({
    type: CLEAR_FB_STATE
  })
};

export const getFacebookPostsCount = (data) => (dispatch) => {
  return FacebookPostService.getFacebookAllPostsCount(data).then(
    (response) => {
      // these are all the facebook post
      const totalPostCount = response.data?.totalPosts || 0;
      const postIds = response.data?.postIds || [];
      const socialMediaTranslations = response.data?.translations?.translations || null;
      const authors = response.data?.authors || [];
      // normalize the authors data
      const normalizeAuthor = {};
      for (let i = 0; i < authors.length; i++) {
        const eachId = authors[i].authorId;
        normalizeAuthor[eachId] = { ...authors[i] };
      }

      dispatch({
        type: SET_FB_POST_IDS_AND_COUNT,
        payload: {
          totalPostCount,
          totalPostIds: postIds,
          pageId: data.pageId,
          socialMediaTranslations: socialMediaTranslations,
          authors: normalizeAuthor
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

      dispatch({
        type: CLEAR_FB_STATE
      });
      return Promise.reject();
    }
  );
};

export const getFacebookPosts = (data) => (dispatch) => {
  dispatch({
    type: SET_FB_LOADING,
    payload: {
      isLoading: true,
    }
  });
  return FacebookPostService.getMediaPostDetails(data).then(
    (response) => {
      let postRecords = response.data?.postDetails || [];
      // normalize the data
      const posts = {};
      const metaData = {};
      let allIds = [];
      for (let i = 0; i < postRecords.length; i++) {
        const eachId = postRecords[i]._id;
        posts[eachId] = { ...postRecords[i], userPost: false };
        metaData[eachId] = {
          like: 'default',
          initLike: postRecords[i].initLike || 0,
          actionId: null,
          parentPostId: null,
          comments: [],
        };
        allIds.push(eachId);
      }
      dispatch({
        type: STACK_FB_STATE,
        payload: {
          posts: posts,
          metaData: metaData,
          allIds: allIds,
          isLoading: false,
        }
      });

      dispatch({
        type: UPDATE_FACEBOOK_PAGE_STATE,
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

      dispatch({
        type: SET_FB_LOADING,
        payload: {
          isLoading: false,
        }
      });

      dispatch({
        type: CLEAR_FB_STATE
      });
      return Promise.reject();
    }
  );
};

// create a action for specific user with 
// adminPostId, actionType, isAdminPost, userPostId, platformType, comment
export const likeFbPost = (data, id) => (dispatch) => {
  return FacebookPostService.createFbAction({ actionObj: data }).then(
    (response) => {
      // this event should render the like transtion on the UI
      dispatch({
        type: SET_FB_POST_LIKE,
        payload: {
          postId: id,
          like: data.action,
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
  dispatch({
    type: SET_FB_LOADING,
    payload: {
      isLoading: true,
    }
  });
  return FacebookPostService.createFbPost(data).then(
    (response) => {
      dispatch({
        type: CREATE_FB_POST,
        payload: {
          _id: response.data._id,
          post: response.data.post,
          attachedMedia: response.data.attachedMedia, // [{ _id: ..., other media details }]
        }
      });
      
      dispatch({
        type: SET_FB_LOADING,
        payload: {
          isLoading: false,
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
        type: SET_FB_LOADING,
        payload: {
          isLoading: false,
        }
      });
      
      dispatch({
        type: SNACKBAR_ERROR,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
