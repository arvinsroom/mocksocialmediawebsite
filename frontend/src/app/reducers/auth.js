import {
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
} from "../actions/types";

const admin = JSON.parse(localStorage.getItem("admin"));

const initialState = admin
  ? { isLoggedInAdmin: true, admin }
  : { isLoggedInAdmin: false, admin: null };

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedInAdmin: true,
        admin: payload.admin,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedInAdmin: false,
        admin: null,
      };
    case LOGOUT:
      return {
        ...state,
        isLoggedInAdmin: false,
        admin: null,
      };
    default:
      return state;
  }
}