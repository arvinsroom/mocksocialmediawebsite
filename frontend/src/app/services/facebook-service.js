import http from "../../http-common";
import userAuthHeader from "./user-auth-header";

// adminPostId, action, isAdminPost, userPostId, platform, comment
export const createFbAction = (data) => {
  return http.post("/user/facebook/action", data, {
    headers: userAuthHeader()
  });
  // return Promise.resolve();
}

export const deleteFbAction = (likeActionId) => {
  return http.delete(`/user/facebook/action/${likeActionId}`, {
    headers: userAuthHeader()
  });
}

// shareText, parentAdminPostId, parentUserPostId
export const shareFbPost = (data) => {
  return http.post("/user/facebook/share", data, {
    headers: userAuthHeader()
  });
}
