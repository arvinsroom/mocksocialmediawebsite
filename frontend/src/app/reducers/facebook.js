import {
  SET_FB_INITIAL_STATE,
  SET_FB_POST_LIKE,
  SET_FB_POST_UNLIKE,
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
} from "../actions/types";
import cloneDeep from 'lodash/cloneDeep';
import { createCachedSelector } from 're-reselect';
import { createSelector } from 'reselect';

const selectAllLikesArr = state => state.facebookPost.metaData;
const selecLikePostID = (state, id) => id;

// function gett() { return }
export const selectAllLikes = createCachedSelector(
  [selectAllLikesArr, selecLikePostID],
  (likesArr, id) => {
    return likesArr[id];
  }
)(
  (state, id) => id
);

const selectAllIDs = state => state.facebookPost.allIds;
// function gett() { return }
export const selectSubIds = createSelector(
  [selectAllIDs],
  (ids) => {
      return ids; //.map(id => <PostT singlePost={items[id]} />)
  }
);

const selectPosts = state => state.facebookPost.posts;
const selectPostsID = (state, id) => id;
// function gett() { return }
export const selectSubItems = createCachedSelector(
  [selectPosts,
    selectPostsID],
  (posts, id) => {
      return posts[id]; //.map(id => <PostT singlePost={items[id]} />)
  }
)(
  (state, id) => id
);

const initialPostState = {
  posts: {},
  allIds: [],
  metaData: {}
};

// this is bad and goes against whole point of using redux but for
// now we can use it as it is a standalone component and we do not have seperate states for post component
// eslint-disable-next-line import/no-anonymous-default-export
export const facebookPost = (state = initialPostState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_FB_INITIAL_STATE:
      return {
        posts: payload.posts,
        allIds: payload.allIds,
        metaData: payload.metaData
      };

      case SET_FB_POST_LIKE:
        return {
          ...state,
          metaData: {
            ...state.metaData,
            [payload.postId]: {
              ...state.metaData[payload.postId],
              like: true,
              actionId: payload.actionId
            }
          }
        };

    case SET_FB_POST_UNLIKE:
      return {
        ...state,
        metaData: {
          ...state.metaData,
          [payload.postId]: {
            ...state.metaData[payload.postId],
            like: false,
            actionId: null
          }
        }
      };

    case SET_FB_POST_LIKE_ACTION_ID:
      state.posts[payload.index].actionId = payload.actionId;
      return {
        ...state
      };

    case NULLIFY_FB_POST_LIKE_ACTION_ID:
      state.posts[payload.index].actionId = null;
      return {
        ...state
      };

    case SET_FB_POST_COMMENT:
      return {
        ...state,
        metaData: {
          ...state.metaData,
          [payload.postId]: {
            ...state.metaData[payload.postId],
            comments: [ payload.comment, ...state.metaData[payload.postId].comments]
          }
        }
      };

    case CREATE_FB_POST:
      return {
        ...state,
        posts: {
          [payload._id]: {
            _id: payload._id,
            type: payload.type,
            name: 'New Post',
            postMessage: payload.postMessage ? payload.postMessage : "",
            attachedMediaAdmin: payload.attachedMediaAdmin
          },
          ...state.posts,
        },
        metaData: {
          [payload._id]: {
            comments: [],
            like: false,
            actionId: null,
            isAdmin: false,
          },
          ...state.metaData,
        },
        allIds: [payload._id, ...state.allIds]
      };

    case SHARE_FB_POST:
      return {
        ...state,
        posts: {
          [payload._id]: {
            _id: payload._id,
            type: 'SHARE',
            name: 'Shared Post',
            postMessage: payload.shareText ? payload.shareText : "",
            parentAdminPostId: payload.parentAdminPostId,
            parentUserPostId: payload.parentUserPostId
          },
          ...state.posts,
        },
        metaData: {
          [payload._id]: {
            comments: [],
            like: false,
            actionId: null,
            isAdmin: false,
          },
          ...state.metaData,
        },
        allIds: [payload._id, ...state.allIds]
      };

    default:
      return state;
  }
}
