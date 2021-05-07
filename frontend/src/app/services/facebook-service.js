import http from "../../http-common";
import userAuthHeader from "./user-auth-header";

// adminPostId, action, isAdminPost, userPostId, platform, comment
export const createFbAction = (data) => {
  return http.post("/user/facebook/action", data, {
    headers: userAuthHeader()
  });
}

export const deleteFbAction = (likeActionId) => {
  return http.delete(`/user/facebook/action/${likeActionId}`, {
    headers: userAuthHeader()
  });
}

export const createFbPost = (data) => {
  return http.post("/user/facebook/new", data, {
    headers: {
      ...userAuthHeader(),
      "Content-Type": "multipart/form-data",
    }
  });
}

// This works as a get request for now
// data includes all postIds to be retrived
export const getMediaPostDetails = (data) => {
  return http.post(`/user/facebook/posts`, data, {
    headers: userAuthHeader()
  });
}

export const getFacebookAllPostsCount = (data) => {
  return http.get(`/user/facebook/${data.templateId}/${data.platform}/${data.language}/${data.pageId}/${data.order}`, {
    headers: userAuthHeader()
  });
}

export const getFacebookFakeActionPosts = (pageId) => {
  return http.get(`/user/facebook/fake/actions/${pageId}`, {
    headers: userAuthHeader()
  });
}
