import {
  SET_TEMPLATE_ID,
  PREV_TEMPLATES_SUCCESS,
  CLEAR_TEMPLATE_STATE
} from "../actions/types";

const initialState = {
  _id: null,
  name: "",
  prevTemplates: null
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_TEMPLATE_ID:
      return {
        ...state,
        _id: payload._id,
        name: payload.name
      };
    
    case PREV_TEMPLATES_SUCCESS:
      return {
        ...state,
        prevTemplates: payload.prevTemplates,
      };

    case CLEAR_TEMPLATE_STATE:
      return {
        ...state,
        prevTemplates: null,
        _id: null,
        name: "",
      };

    default:
      return state;
  }
}
