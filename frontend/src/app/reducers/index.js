import { combineReducers } from "redux";
import auth from "./auth";
import template from "./template";
import snackbar from './snackbar';
import userAuth from './userAuth';
import flowState from './flowState';


export default combineReducers({
  auth,
  template,
  snackbar,
  userAuth,
  flowState
});