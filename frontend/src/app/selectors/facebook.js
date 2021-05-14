import { createCachedSelector } from 're-reselect';
import { createSelector } from 'reselect';

const selectPostsMetadataArr = state => state.facebook.metaData;
const selecLikePostID = (state, id) => id;

export const selectPostsMetadata = createCachedSelector(
  [selectPostsMetadataArr, selecLikePostID],
  (likesArr, id) => {
    return likesArr[id];
  }
)(
  (state, id) => id
);

const selectAllIDs = state => state.facebook.allIds;
export const selectAllPostIds = createSelector(
  [selectAllIDs],
  (ids) => {
      return ids;
  }
);

const selectPosts = state => state.facebook.posts;
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