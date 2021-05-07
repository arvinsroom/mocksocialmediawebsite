import http from "../../http-common";
import authHeader from "./auth-header";

export const create = (data) => {
  return http.post("/language", data, {
    headers: authHeader()
  });
}

export const createGlobalLanguages = (data) => {
  return http.post("/language/global", data, {
    headers: authHeader()
  });
}

export const getGlobalLanguagesAdmin = () => {
  return http.get("/language/global", {
    headers: authHeader()
  });
}


// fetch languages for specific template
export const getLanguages = (_id) => {
  return http.get(`/language/${_id}`, {
    headers: authHeader()
  });
}
