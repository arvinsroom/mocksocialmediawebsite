import {
  SET_GLOBAL_ACTIVE_LANGUAGE,
  SET_GLOBAL_LANGUAGES,
} from "../actions/types";

const initialState = {
  languages: [],
  active: null,
  default: null
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_GLOBAL_LANGUAGES:
      return {
        languages: payload.languages,
        active: null,
        default: payload.default,
      };

    // when ever we modify the active flow state, initilize disabled prop to be true
    case SET_GLOBAL_ACTIVE_LANGUAGE:
      return {
        ...state,
        active: payload.active
      };
    
    default:
      return state;
  }
};
