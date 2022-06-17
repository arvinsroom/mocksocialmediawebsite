import {
  UPDATE_FLOW_STATE,
  CLEAR_FLOW_STATE,
  SNACKBAR_ERROR
} from "./types";
import { trackPageMetaData } from "../services/user-tracking-service";
import { getCurrentUTCTime } from '../utils';

export const updateFlowActiveState = () => (dispatch, getState) => {
  const { flow, active } = getState().flowState;
  // before going to next flow, update the finish time of current flow
  // note here active still points to prev flow nums
  if (active > -1 && (flow[active].type === 'FACEBOOK' || flow[active].type === 'TWITTER')) {
    return trackPageMetaData({ finishedAt: getCurrentUTCTime(), pageId: flow[active]._id }).then(
      () => {
        dispatch({
          type: UPDATE_FLOW_STATE,
        });
        return Promise.resolve();
      },
      () => {
        dispatch({
          type: SNACKBAR_ERROR,
          payload: "Unable to store the finish time.",
        });
        return Promise.reject();
      }
    );
  } else {
    dispatch({
      type: UPDATE_FLOW_STATE,
    });
    return Promise.resolve();
  }
};

export const clearFlowState = () => ({
  type: CLEAR_FLOW_STATE
});
