import { combineReducers } from "redux";
import auth from "./auth";
import message from "./message";
import template from "./template";

export default combineReducers({
  auth,
  message,
  template
});