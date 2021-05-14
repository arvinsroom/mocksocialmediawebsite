import {
  SET_PAGE_META_DATA,
  ADD_PAGE_META_DATA,
  CLEAR_PAGE_META_DATA
} from "../actions/types";

const initialState = {
  pageData: {},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_PAGE_META_DATA:
      return {
        ...state,
        pageData: {
          ...state.pageData,
          [payload.pageId]: {
            ...state.pageData[payload.pageId],
            metaData: {
              ...payload.metaData
            }
          }
        }
      };

    case CLEAR_PAGE_META_DATA:
      return {
        ...state,
        pageData: {},
      };

    default:
      return state;
  }
}
