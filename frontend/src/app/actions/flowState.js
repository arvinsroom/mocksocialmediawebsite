import {
  SET_FLOW_STATE,
  MODIFY_ACTIVE_FLOW_STATE
} from "./types";

export const setFlowActiveState = (flow, active) => ({
  type: SET_FLOW_STATE,
  payload: { flow, active }
});

export const updateFlowActiveState = (active) => ({
  type: MODIFY_ACTIVE_FLOW_STATE,
  payload: { active }
});
