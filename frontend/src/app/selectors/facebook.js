import { createCachedSelector } from 're-reselect';
import { createSelector } from 'reselect';

const selectPostsMetadataArr = state => state.facebookPost.metaData;
const selecLikePostID = (state, id) => id;

export const selectPostsMetadata = createCachedSelector(
  [selectPostsMetadataArr, selecLikePostID],
  (likesArr, id) => {
    return likesArr[id];
  }
)(
  (state, id) => id
);

const selectAllIDs = state => state.facebookPost.allIds;
export const selectAllPostIds = createSelector(
  [selectAllIDs],
  (ids) => {
      return ids;
  }
);

const selectPosts = state => state.facebookPost.posts;
const selectPostsID = (state, id) => id;
export const selectSinglePost = createCachedSelector(
  [selectPosts,
    selectPostsID],
  (posts, id) => {
      return posts[id];
  }
)(
  (state, id) => id
);