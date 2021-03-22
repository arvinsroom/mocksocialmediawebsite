import http from "../../http-common";
import authHeader from "./auth-header";

export const create = (data) => {
  return http.post("/media", data, {
    headers: authHeader()
  });
}
