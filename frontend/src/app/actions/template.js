import {
  SET_TEMPLATE_ID,
  PREV_TEMPLATES_SUCCESS,
  PREV_TEMPLATES_FAIL,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS
} from "./types";

import * as TemplateService from "../services/template-service";

export const setTemplateId = (_id) => ({
  type: SET_TEMPLATE_ID,
  payload: _id,
});

// fetch using admin _id
export const getPrevTemplate = () => (dispatch) => {
  return TemplateService.getPrevTemplates().then(
    ({data}) => {
      dispatch({
        type: PREV_TEMPLATES_SUCCESS,
        payload: {
          prevTemplates: data,
        },
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
        type: PREV_TEMPLATES_FAIL,
      });

      dispatch({
        type: SNACKBAR_ERROR,
        payload: message,
      });

      return Promise.reject();
    }
  );
};

export const deletePrevTemplate = (_id) => (dispatch) => {
  return TemplateService.deletePrevTemplate(_id)
    .then(({data}) => {

      dispatch({
        type: SNACKBAR_SUCCESS,
        payload: data,
      });

      Promise.resolve();
    })
    .catch(error => {
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
