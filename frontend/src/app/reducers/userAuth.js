import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "../actions/types";

// we do not want to store information,
// every new sign in will have new response
const initialState = {}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedInUser: true,
        user: payload.user.accessToken,
        translations: payload.user.translations,
        flow: payload.user.flow
      };
    case USER_LOGIN_FAIL:
      return {
        ...state,
        isLoggedInUser: false,
        user: null,
        translations: null,
        flow: null,
      };
    case USER_LOGOUT:
      return {
        ...state,
        isLoggedInUser: false,
        user: null,
        translations: null,
        flow: null,
      };
    default:
      return state;
  }
}