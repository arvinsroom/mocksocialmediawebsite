import {
  USER_LOGIN_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGOUT,
} from "../actions/types";

const initialState = {
  isLoggedInUser: false,
  translations: null,
  templateId: null,
  languageName: ""
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedInUser: true,
        translations: payload.user.translations?.translations || null,
        templateId: payload.user.templateId,
        languageName: payload.user.translations?.name || "ENGLISH"
      };
    case USER_LOGIN_FAIL:
      return {
        ...state,
        isLoggedInUser: false,
        translations: null,
        templateId: null,
        languageName: "ENGLISH"
      };
    case USER_LOGOUT:
      return {
        ...state,
        isLoggedInUser: false,
        // translations: null,
        templateId: null,
        languageName: ""
      };
    default:
      return state;
  }
}