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
  SET_FB_POST_LIKE_NEW
} from "../actions/types";

const initialPostState = {
  posts: [],
};

const initialMediaState = {
  media: []
};

const initialLikesState = {
  likes: []
};

const initialTotalFbState = {
  posts: 0
};

export const facebookMedia = (state = initialMediaState, action) => {
const { type, payload } = action;

switch (type) {
  case SET_FB_MEDIA_INITIAL_STATE:
    return {
      media: payload.media,
    };

  default:
    return state;
  }
}

export const facebookLikes = (state = initialLikesState, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case SET_FB_LIKES_INITIAL_STATE:
      return {
        likes: payload.likes,
      };
    
    case SET_FB_POST_LIKE_NEW:
      let newState = { ...state.likes };
      newState[payload] = true;
      return {
        likes: newState
      }
  
    default:
      return state;
    }
  }

export const facebookTotalPosts = (state = initialTotalFbState, action) => {
  const { type, payload } = action;
  
  switch (type) {
    case SET_FB_TOTAL_INITIAL_STATE:
      return {
        totalPosts: payload.totalPosts,
      };
  
    default:
      return state;
    }
  }

// this is bad and goes against whole point of using redux but for
// now we can use it as it is a standalone component and we do not have seperate states for post component
// eslint-disable-next-line import/no-anonymous-default-export
export const facebookPost = (state = initialPostState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_FB_INITIAL_STATE:
      return {
        posts: payload.posts,
      };

    case SET_FB_POST_LIKE:
      // state.posts[payload.index].like = true;
      return {
        ...state,
        posts: state.posts.map((post, i) =>
        i === payload.index
          ? {
              ...post,
              like: true
            }
          : post
      )
      };

    case SET_FB_POST_UNLIKE:
      state.posts[payload.index].like = false;
      return {
        ...state
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
      let newCommentArr = [ payload.comment, ...state.posts[payload.index].comments];
      state.posts[payload.index].comments = newCommentArr;
      return {
        ...state
      };

    case CREATE_FB_POST:
      // create 
      return {
        ...state
      }

    case TOGGLE_COMMENT_BOX:
      state.posts[payload.index].openComments = !state.posts[payload.index].openComments;
      return {
        ...state
      };

    case HANDLE_CHANGE_COMMENT:
      state.posts[payload.index].currentComment = payload.comment;
      return {
        ...state
      };

    // shareText, parentAdminPostId, parentUserPostId
    case SHARE_FB_POST:
      console.log('payload.parentAdminPostIndex: ', payload.parentAdminPostIndex);
      console.log('payload.parentUserPostIndex: ', payload.parentUserPostIndex);
      const newPost = {
        _id: payload._id,
        isAdmin: false,
        postMessage: payload.shareText,
        parentAdminPostIndex: (payload.parentAdminPostIndex !== -1) ? (payload.parentAdminPostIndex + 1) : -1,
        parentUserPostIndex: (payload.parentUserPostIndex !== -1) ? (payload.parentUserPostIndex + 1) : -1,
        type: 'SHARE',
        name: 'Shared Post',
        openComments: false,
        comments: [],
        currentComment: '',
        like: false,
      }
      console.log(newPost);
      // unshift into the post array
      state.posts.unshift(newPost);
      return {
        ...state
      };

    default:
      return state;
  }
}
