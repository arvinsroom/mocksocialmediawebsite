import http from "../../http-common";
import userAuthHeader from "./user-auth-header";

export const trackLinkClick = (data) => {
  return http.post('/user/tracking/post', data, {
    headers: userAuthHeader()
  });
}

export const trackPageMetaData = (data) => {
  return http.post('/user/tracking/global', data, {
    headers: userAuthHeader()
  });
}