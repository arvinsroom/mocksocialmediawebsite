import {
  UPDATE_FLOW_STATE,
  CLEAR_FLOW_STATE
} from "./types";

export const updateFlowActiveState = () => ({
  type: UPDATE_FLOW_STATE
});

export const clearFlowState = () => ({
  type: CLEAR_FLOW_STATE
});
