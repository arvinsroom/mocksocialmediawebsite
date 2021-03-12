import * as actions from './actionTypes';
// initial state = {}

export default function reducer(state = {}, action) {
  if (action.type === actions.CHANGE_TEMPLATE_ID) {
    newState = {};
    newState.templateId = action.payload.templateId;
    return newState;
  }

  // else do nothing action unknown
  return state;
}
