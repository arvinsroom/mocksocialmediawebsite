import http from "../../http-common";
import authHeader from "./auth-header";

export const update = (data) => {
  return http.put("/page", data, {
    headers: authHeader()
  });
}

export const get = (_id) => {
  return http.get(`/page/${_id}`, {
    headers: authHeader()
  });
}

export const getSocialMediaPages = (templateId) => {
  return http.get(`/page/socialmedia/${templateId}`, {
    headers: authHeader()
  });
}