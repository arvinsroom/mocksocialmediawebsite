import { combineReducers } from "redux";
import auth from "./auth";
import template from "./template";
import snackbar from './snackbar';
import userAuth from './userAuth';
import flowState from './flowState';
import pageMetaData from './pageMetaData';
import facebook from './facebook';

export default combineReducers({
  auth,
  template,
  snackbar,
  userAuth,
  flowState,
  facebook,
  pageMetaData
});
