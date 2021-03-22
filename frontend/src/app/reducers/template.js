import {
  SET_TEMPLATE_ID,
  PREV_TEMPLATES_SUCCESS,
  PREV_TEMPLATES_FAIL
} from "../actions/types";

const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_TEMPLATE_ID:
      return { _id: payload };
    
    case PREV_TEMPLATES_SUCCESS:
      return {
        ...state,
        prevTemplates: payload.prevTemplates,
      };

    case PREV_TEMPLATES_FAIL:
      return {
        ...state,
        prevTemplates: null
      };

    default:
      return state;
  }
}
