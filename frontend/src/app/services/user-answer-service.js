import http from "../../http-common";
import userAuthHeader from "./user-auth-header";

export const createMCQ = (data) => {
  return http.post("/user/answer/mcq", data, {
    headers: userAuthHeader()
  });
}

// for both MCQ and opentext questions
export const createOpentext = (data) => {
  return http.post("/user/answer/opentext", data, {
    headers: userAuthHeader()
  });
}

