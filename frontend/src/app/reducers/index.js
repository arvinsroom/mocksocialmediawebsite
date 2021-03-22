import { combineReducers } from "redux";
import auth from "./auth";
import template from "./template";
import snackbar from './snackbar';

export default combineReducers({
  auth,
  template,
  snackbar
});