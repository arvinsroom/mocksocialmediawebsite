import http from "../../http-common";
import authHeader from "./auth-header";

// for both MCQ and opentext questions
export const create = (data) => {
  return http.post("/questions", data, {
    headers: authHeader()
  });
}