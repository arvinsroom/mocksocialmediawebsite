import { SET_TEMPLATE_ID } from "./types";

export const setTemplateId = (_id) => ({
  type: SET_TEMPLATE_ID,
  payload: _id,
});
