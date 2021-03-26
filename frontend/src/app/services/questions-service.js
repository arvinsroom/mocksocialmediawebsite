import http from "../../http-common";
import authHeader from "./auth-header";
import userAuthHeader from "./user-auth-header";

// for both MCQ and opentext questions
export const create = (data) => {
  return http.post("/questions", data, {
    headers: authHeader()
  });
}

// user ROUTES
export const getQuestions = (pageId, type) => {
  return http.get(`/user/questions/${pageId}/${type}`, {
    headers: userAuthHeader()
  });
}
