import {
  STACK_FB_STATE,
  SET_FB_POST_LIKE,
  SET_FB_POST_UNLIKE,
  SET_POST_REPORT,
  SET_POST_UNREPORT,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  SET_FB_POST_COMMENT,
  CREATE_FB_POST,
  SET_FB_LOADING,
  SET_FB_POST_IDS_AND_COUNT,
  SET_FB_POST_FETCH_FINISH,
  UPDATE_FACEBOOK_PAGE_STATE,
  CLEAR_FB_STATE,
  UNDO_POST,
  INCREMENT_REPLIES_COUNT,
  INCREMENT_QUOTE_RETWEET_COUNT,
  DECREMENT_QUOTE_RETWEET_COUNT
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
      // these are all the posts
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

// Facebook original with comments rendered here
export const getFacebookWithCommentsPosts = (data) => (dispatch) => {
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
        if (postRecords[i].isReplyTo !== null) {
          const parentId = postRecords[i].parentPostId;
          // find the parent post from metaData and add the
          // postMessage from current post to the comment section of that post
          if (metaData[parentId]) {
            metaData[parentId] = {
              ...metaData[parentId],
              comments: [
                ...metaData[parentId].comments,
                {
                  postId: parentId,
                  attachedAuthorPicture: postRecords[i].attachedAuthorPicture,
                  comment: postRecords[i].postMessage,
                  userComment: false,
                  authorId: postRecords[i].authorId
                }
              ]
            }
          } else {
            const obj = {
              postId: parentId,
              attachedAuthorPicture: postRecords[i].attachedAuthorPicture,
              comment: postRecords[i].postMessage,
              userComment: false,
              authorId: postRecords[i].authorId
            };
            dispatch({
              type: SET_FB_POST_COMMENT,
              payload: obj
            });
          }
        } else {
          posts[eachId] = { ...postRecords[i], userPost: false };
          metaData[eachId] = {
            like: 'default',
            type: postRecords[i].type,
            initLike: postRecords[i].initLike || 0,
            actionId: null,
            parentPostId: null,
            comments: [],
            initReply: postRecords[i].initReply,
            initTweet: postRecords[i].initTweet,
            checkersLink: postRecords[i].checkersLink,
            warningLabel: postRecords[i].warningLabel,
          };
          allIds.push(eachId);
        }
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

export const getTwitterPosts = (data) => (dispatch) => {
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
          type: postRecords[i].type,
          initLike: postRecords[i].initLike || 0,
          actionId: null,
          parentPostId: null,
          comments: [],
          initReply: postRecords[i].initReply,
          initTweet: postRecords[i].initTweet
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

export const getFacebookPost = (data) => (dispatch) => {
  return FacebookPostService.getMediaPostDetails(data).then(
    (response) => {
      let postRecords = response.data?.postDetails || [];
      // normalize the data
      const posts = {};
      let eachId = null;
      for (let i = 0; i < postRecords.length; i++) {
        eachId = postRecords[i]._id;
        let userPostCheck = postRecords[i].adminPostId ? false : true;
        posts[eachId] = { ...postRecords[i], userPost: userPostCheck };
      }
      if (eachId) {
        return Promise.resolve(posts[eachId]);
      }
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

export const updatePost = (data) => (dispatch) => {
  return FacebookPostService.updatePost(data).then(
    () => {
      // this event should undo the retweet from postArray and render the UI properly
      dispatch({
        type: UNDO_POST,
        payload: {
          postId: data.id
        }
      });

      dispatch({
        type: SNACKBAR_SUCCESS,
        payload: "Your retweet has been undone.",
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
          attachedAuthorPicture: null,
          comment: data.comment,
          userComment: true,
          authorId: null
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

//create action to delete FB report
export const unreportPost = (actionId, id) => (dispatch) => {
  return FacebookPostService.deleteFbAction(actionId).then(
    () => {
      
      dispatch({
        type: SET_POST_UNREPORT,
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

export const reportPost = (data, id) => (dispatch) => {
  return FacebookPostService.createFbAction({ actionObj: data }).then(
    (response) => {
      dispatch({
        type: SET_POST_REPORT,
        payload: {
          postId: id,
          reportId: response.data._id
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

export const incrementRepliesCount = (data) => (dispatch) => {
  dispatch({
    type: INCREMENT_REPLIES_COUNT,
    payload: {
      _id: data._id,
    }
  });
};

export const incrementQuoteRetweetCount = (data) => (dispatch) => {
  dispatch({
    type: INCREMENT_QUOTE_RETWEET_COUNT,
    payload: {
      _id: data._id,
    }
  });
};

export const decrementQuoteRetweetCount = (data) => (dispatch) => {
  dispatch({
    type: DECREMENT_QUOTE_RETWEET_COUNT,
    payload: {
      _id: data._id,
    }
  });
};