import {
  SET_FLOW_STATE,
  CLEAR_FLOW_STATE,
  UPDATE_FLOW_STATE,
} from "../actions/types";

const initialState = {
  flow: [],
  active: -1,
  finished: false,
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SET_FLOW_STATE:
      return {
        flow: payload.flow,
        active: payload.active,
        finished: payload.finished
      };

    // when ever we modify the active flow state, initilize disabled prop to be true
    case UPDATE_FLOW_STATE:
      let nextState = state.active;
      let finished = false;
      let flow = [...state.flow];
      if (nextState >= state.flow.length - 1) {
        finished = true;
        nextState = -1;
        flow = [];
      } else nextState += 1;
      return {
        ...state,
        active: nextState,
        finished: finished,
        flow: flow
      };

    case CLEAR_FLOW_STATE:
      return {
        flow: [],
        active: -1,
        finished: true
      };
    
    default:
      return state;
  }
};
