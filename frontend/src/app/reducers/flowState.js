import { SET_FLOW_STATE, CLEAR_FLOW_STATE, MODIFY_ACTIVE_FLOW_STATE } from "../actions/types";

const initialState = {
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_FLOW_STATE:
      return {
        flow: payload.flow,
        active: payload.active
      };

    case MODIFY_ACTIVE_FLOW_STATE:
      return {
        ...state,
        active: payload.active
      };

    case CLEAR_FLOW_STATE:
      return {
        flow: null,
        active: null
      };
    
    default:
      return state;
  }
};
