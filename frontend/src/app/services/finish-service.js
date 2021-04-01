import http from "../../http-common";
import authHeader from "./auth-header";
import userAuthHeader from './user-auth-header';

export const create = (data) => {
  return http.post("/finish", data, {
    headers: authHeader()
  });
}

// USER Routes
// fetch what needs to be rendered on finish page
// this should be the last page rendered
export const getUserFinishDetails = (pageId) => {
  return http.get(`/user/finish/${pageId}`, {
    headers: userAuthHeader()
  });
}

