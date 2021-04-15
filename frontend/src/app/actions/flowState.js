import {
  SET_FLOW_STATE,
  MODIFY_ACTIVE_DISABLED_FLOW_STATE,
  MODIFY_DISABLED_FLOW_STATE,
  CLEAR_FLOW_STATE
} from "./types";

export const setFlowActiveState = (flow, active, disabled) => ({
  type: SET_FLOW_STATE,
  payload: { flow, active, disabled }
});

export const updateFlowActiveState = () => ({
  type: MODIFY_ACTIVE_DISABLED_FLOW_STATE
});

export const updateFlowDisabledState = () => ({
  type: MODIFY_DISABLED_FLOW_STATE
});

export const clearFlowState = () => ({
  type: CLEAR_FLOW_STATE
});
