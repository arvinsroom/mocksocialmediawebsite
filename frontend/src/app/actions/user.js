import {
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS,
  MODIFY_DISABLED_FLOW_STATE
 } from "./types";

import * as UserMainService from '../services/user-main-service';

export const updateUser = (data) => (dispatch) => {
  return UserMainService.updateUser(data).then(
    () => {
      dispatch({
        type: SNACKBAR_SUCCESS,
        payload: "Response successfully saved!",
      });

      dispatch({
        type: MODIFY_DISABLED_FLOW_STATE
      });

      return Promise.resolve();
    },
    (error) => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch({
        type: SNACKBAR_ERROR,
        payload: message,
      });

      return Promise.reject();
    }
  );
};
