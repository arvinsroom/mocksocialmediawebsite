import http from "../../http-common";
import authHeader from "./auth-header";

// create the object for template excluding flow
export const create = (data) => {
  return http.post("/template", data, {
    headers: authHeader()
  });
}
