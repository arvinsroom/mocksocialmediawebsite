import { combineReducers } from "redux";
import auth from "./auth";
import template from "./template";
import snackbar from './snackbar';
import userAuth from './userAuth';
import flowState from './flowState';
import { facebookMedia, facebookPost, facebookLikes, facebookTotalPosts } from './facebook';

export default combineReducers({
  auth,
  template,
  snackbar,
  userAuth,
  flowState,
  facebookMedia,
  facebookPost,
  facebookLikes,
  facebookTotalPosts
});