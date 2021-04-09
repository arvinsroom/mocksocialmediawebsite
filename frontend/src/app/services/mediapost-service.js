import http from "../../http-common";
import authHeader from "./auth-header";
import userAuthHeader from "./user-auth-header";

export const create = (data) => {
  return http.post("/media", data, {
    headers: authHeader()
  });
}

// USER Routes
// fetch what needs to be rendered on Social media page
// depending on the pageID, we should have correct socail media page and its respective data
export const getMediaPostDetails = (pageId, order) => {
  return http.get(`/user/media/${pageId}/${order}`, {
    headers: userAuthHeader()
  });
}
