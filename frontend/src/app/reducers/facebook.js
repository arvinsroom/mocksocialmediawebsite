import {
  STACK_FB_STATE,
  SET_FB_POST_LIKE,
  SET_FB_POST_UNLIKE,
  SET_FB_POST_COMMENT,
  CREATE_FB_POST,
  SET_FB_LOADING,
  SET_FB_POST_IDS_AND_COUNT,
  SET_FB_POST_FETCH_FINISH,
  UPDATE_FACEBOOK_PAGE_STATE,
  CLEAR_FB_STATE
} from "../actions/types";

const initialState = {
  posts: {},
  metaData: {},
  allIds: [],
  // name: "",
  isLoading: false,
  pageId: null,
  totalPostCount: 0,
  currentPostPage: 0,
  postEachPage: 5,
  totalPostIds: [],
  finish: false,
  fbTranslations: null
};

// this is bad and goes against whole point of using redux but for
// now we can use it as it is a standalone component and we do not have seperate states for post component
// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_FB_POST_IDS_AND_COUNT:
      return {
        totalPostCount: payload.totalPostCount,
        currentPostPage: 0,
        postEachPage: 5,
        totalPostIds: payload.totalPostIds,
        pageId: payload.pageId,
        // name: payload.name,
        posts: {},
        metaData: {},
        allIds: [],
        isLoading: false,
        finish: false,
        fbTranslations: payload.fbTranslations || null
      };

    case STACK_FB_STATE:
      return {
        ...state,
        posts: {
          ...state.posts,
          ...payload.posts,
        },
        metaData: {
          ...state.metaData,
          ...payload.metaData,
        },
        allIds: [
          ...state.allIds,
          ...payload.allIds,
        ],
        isLoading: payload.isLoading,
      };

      case SET_FB_POST_FETCH_FINISH:
        return {
          ...state,
          finish: true
        }

      case UPDATE_FACEBOOK_PAGE_STATE:
        let nextCurrentPostPage = state.currentPostPage;
        let finish = false;
        if ((nextCurrentPostPage+1) * 5 < state.totalPostCount) {
          nextCurrentPostPage++;
        } else {
          finish = true;
        }
        return {
          ...state,
          currentPostPage: nextCurrentPostPage,
          finish,
        };

      case SET_FB_POST_LIKE:
        return {
          ...state,
          metaData: {
            ...state.metaData,
            [payload.postId]: {
              ...state.metaData[payload.postId],
              like: payload.like,
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
            like: 'default',
            actionId: null
          }
        }
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
      const { type, parentPostId, postMessage } = payload.post;
      return {
        ...state,
        posts: {
          [payload._id]: {
            _id: payload._id,
            type: type,
            // name: state.name,
            userPost: true,
            postMessage: postMessage,
            parentPostId: parentPostId,
            attachedMedia: payload.attachedMedia
          },
          ...state.posts,
        },
        metaData: {
          [payload._id]: {
            comments: [],
            like: 'default',
            actionId: null,
            parentPostId: parentPostId,
          },
          ...state.metaData,
        },
        allIds: [payload._id, ...state.allIds]
      };

    case SET_FB_LOADING:
      return {
        ...state,
        isLoading: payload.isLoading
      };
    
    case CLEAR_FB_STATE:
      return {
        ...state,
        posts: {},
        metaData: {},
        allIds: [],
        // name: "",
        isLoading: false,
        pageId: null,
        totalPostCount: 0,
        currentPostPage: 0,
        postEachPage: 5,
        totalPostIds: [],
        finish: false,
        fbTranslations: null
      }
    
    default:
      return state;
  }
}
