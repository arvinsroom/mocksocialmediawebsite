import http from "../../http-common";
import authHeader from "./auth-header";

export const create = (data) => {
  return http.post("/language", data, {
    headers: authHeader()
  });
}

// fetch languages for specific template
export const getLanguages = (_id) => {
  return http.get(`/language/${_id}`, {
    headers: authHeader()
  });
}

// make this language id isActive
// make sure only one language per platform is active
export const updateIsActive = (data) => {
  return http.put("/language", data, {
    headers: authHeader()
  });
}
