import {
  SET_FLOW_STATE,
  CLEAR_FLOW_STATE,
  MODIFY_ACTIVE_DISABLED_FLOW_STATE,
  MODIFY_DISABLED_FLOW_STATE
} from "../actions/types";

const initialState = {
  flow: [],
  active: -1,
  disabled: true
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_FLOW_STATE:
      return {
        flow: payload.flow,
        active: payload.active,
        disabled: payload.disabled
      };

    // when ever we modify the active flow state, initilize disabled prop to be true
    case MODIFY_ACTIVE_DISABLED_FLOW_STATE:
      return {
        ...state,
        active: state.active + 1,
        disabled: true,
      };

    case MODIFY_DISABLED_FLOW_STATE:
      return {
        ...state,
        disabled: false,
      };

    case CLEAR_FLOW_STATE:
      return {
        flow: [],
        active: -1,
        disabled: true
      };
    
    default:
      return state;
  }
};
