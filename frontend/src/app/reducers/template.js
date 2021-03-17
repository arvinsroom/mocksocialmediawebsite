import { SET_TEMPLATE_ID } from "../actions/types";

const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_TEMPLATE_ID:
      return { _id: payload };

    default:
      return state;
  }
}
