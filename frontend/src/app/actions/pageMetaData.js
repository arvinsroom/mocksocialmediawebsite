import {
  ADD_PAGE_META_DATA,
  CLEAR_PAGE_META_DATA
} from "./types";

export const setPageMetaData = (data) => ({
  type: ADD_PAGE_META_DATA,
  payload: {
    pageId: data?.pageId || {},
    metaData: data?.metaData || {}
  }
});

export const clearPageMetaData = (pageId) => ({
  type: CLEAR_PAGE_META_DATA,
  payload: {
    pageId
  }
});
