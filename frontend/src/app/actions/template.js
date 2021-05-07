import {
  SET_TEMPLATE_ID,
  PREV_TEMPLATES_SUCCESS,
  CLEAR_TEMPLATE_STATE,
  SNACKBAR_ERROR,
  SNACKBAR_SUCCESS
} from "./types";

import * as TemplateService from "../services/template-service";

export const setTemplateId = (template) => ({
  type: SET_TEMPLATE_ID,
  payload: {
    _id: template._id,
    name: template.name
  },
});

export const clearTemplate = () => ({
  type: CLEAR_TEMPLATE_STATE
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
        type: CLEAR_TEMPLATE_STATE,
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

export const updateTemplate = (data) => (dispatch) => {
  return TemplateService.updateTemplate(data)
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
