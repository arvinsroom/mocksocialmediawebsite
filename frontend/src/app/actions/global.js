import {
  SET_GLOBAL_LANGUAGES,
  SNACKBAR_ERROR,
  SET_GLOBAL_ACTIVE_LANGUAGE
} from "./types";

import * as LanguageService from "../services/language-service";

export const getAllLanguagesData = () => (dispatch) => {
  return LanguageService.getMockAllLanguages().then(
    (response) => {
      // response data
      const result = response.data?.language || null;
      // normalize the data
      let normal = {};
      let defaultLan = null;
      if (result) {
        for (let i = 0; i < result.length; i++) {
          if (result[i].name === 'ENGLISH') defaultLan = result[i]._id;
          normal[result[i]._id] = {
            name: result[i].name,
            translations: JSON.parse(result[i].translations)
          }
        }
      }
      console.log(normal);
      dispatch({
        type: SET_GLOBAL_LANGUAGES,
        payload: {
          languages: normal,
          default: defaultLan
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
        type: SNACKBAR_ERROR,
        payload: message
      });

      return Promise.reject();
    }
  );
};

export const setActiveLanguage = (active) => ({
  type: SET_GLOBAL_ACTIVE_LANGUAGE,
  payload: {
    active
  },
});