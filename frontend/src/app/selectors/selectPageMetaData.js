import { createCachedSelector } from 're-reselect';

const selectPageMetadata = state => state.pageMetaData.metaData;
const selectPageId = (state, id) => id;

export const selectPostsMetadata = createCachedSelector(
  [selectPageMetadata, selectPageId],
  (pages, pageId) => {
    return pages[pageId];
  }
)(
  (state, id) => id
);
