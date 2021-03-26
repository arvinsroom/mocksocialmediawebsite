import http from "../../http-common";
import authHeader from "./auth-header";
import userAuthHeader from "./user-auth-header";

export const create = (data) => {
  return http.post("/register", `data`, {
    headers: authHeader()
  });
}

// USER Routes
// fetch what needs to be rendered on registration page
export const getUserRegisterDetails = (pageId) => {
  return http.get(`/user/register/${pageId}`, {
    headers: userAuthHeader()
  });
}

// store user response register response
export const createUserRegister = (data) => {
  return http.post("/user/register", data, {
    headers: userAuthHeader()
  });
}

