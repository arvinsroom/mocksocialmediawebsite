import http from "../../http-common";
import userAuthHeader from "./user-auth-header";

export const updateUser = (data) => {
  return http.post("/user/main", data, {
    headers: userAuthHeader()
  });
}