import http from "../../http-common";
import authHeader from "./auth-header";
import userAuthHeader from "./user-auth-header";

export const create = (data) => {
  return http.post("/info", data, {
    headers: authHeader()
  });
}

// USER Routes
// fetch what needs to be rendered on registration page
export const getUserInfoDetails = (pageId) => {
  return http.get(`/user/info/${pageId}`, {
    headers: userAuthHeader()
  });
}
