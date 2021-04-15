import { SNACKBAR_CLEAR, SNACKBAR_SUCCESS, SNACKBAR_ERROR, SNACKBAR_INFO } from "../actions/types";

const initialState = { 
  type: null,
  open: false,
  snackbarMessage: null
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case SNACKBAR_SUCCESS:
      return {
        type: "S",
        open: true,
        snackbarMessage: payload
      };
    
    case SNACKBAR_ERROR:
      return {
        type: "E",
        open: true,
        snackbarMessage: payload
    };

    case SNACKBAR_INFO:
      return {
        type: "I",
        open: true,
        snackbarMessage: payload
    };

    case SNACKBAR_CLEAR:
      return {
        type: null,
        open: false,
        snackbarMessage: null
      };
    
    default:
      return state;
  }
};
