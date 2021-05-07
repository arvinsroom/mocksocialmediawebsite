import http from "../../http-common";
import userAuthHeader from "./user-auth-header";

export const trackLinkClick = (data) => {
  return http.post('/user/tracking', data, {
    headers: userAuthHeader()
  });
}
