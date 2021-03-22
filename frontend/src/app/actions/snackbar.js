import {
  SNACKBAR_SUCCESS,
  SNACKBAR_CLEAR,
  SNACKBAR_INFO,
  SNACKBAR_ERROR
 } from "./types";

export const showSuccessSnackbar = (message) => ({
  type: SNACKBAR_SUCCESS,
  payload: message,
});

export const showErrorSnackbar = (message) => ({
  type: SNACKBAR_ERROR,
  payload: message,
});

export const showInfoSnackbar = (message) => ({
  type: SNACKBAR_INFO,
  payload: message,
});

export const clearSnackbar = () => ({
  type: SNACKBAR_CLEAR,
});
