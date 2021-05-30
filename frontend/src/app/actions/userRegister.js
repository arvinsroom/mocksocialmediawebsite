import {
  SET_REGISTER_META_DATA,
  CLEAR_REGISTER_META_DATA
} from "./types";

export const setRegisterMetaData = (data) => ({
  type: SET_REGISTER_META_DATA,
  payload: {
    metaData: data || {}
  }
});

export const clearRegisterMetaData = () => ({
  type: CLEAR_REGISTER_META_DATA,
});
