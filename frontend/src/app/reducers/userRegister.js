import {
  SET_REGISTER_META_DATA,
  CLEAR_REGISTER_META_DATA
} from "../actions/types";

const initialState = {
  metaData: {},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_REGISTER_META_DATA:
      return {
        ...state,
        metaData: payload.metaData,
      };

    case CLEAR_REGISTER_META_DATA:
      return {
        ...state,
        metaData: {},
      };

    default:
      return state;
  }
}
