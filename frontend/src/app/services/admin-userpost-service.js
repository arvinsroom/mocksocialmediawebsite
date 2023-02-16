import http from "../../http-common";
import authHeader from "./auth-header";

export const getSocialMediaPosts = (templateId, pageId) => {
  return http.get(`/userposts/mediapage/${templateId}/${pageId}`, {
    headers: authHeader()
  });
}

export const setSocialMediaLabels = (data) => {
  return http.post('/userposts/mediapage/labels', data, {
    headers: authHeader()
  });
}
