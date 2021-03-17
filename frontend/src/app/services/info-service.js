import http from "../../http-common";
import authHeader from "./auth-header";

export const create = (data) => {
  return http.post("/info", data, {
    headers: authHeader()
  });
}
