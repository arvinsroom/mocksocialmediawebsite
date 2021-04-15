import http from "../../http-common";
import authHeader from "./auth-header";

// create the object for template excluding flow
export const create = (data) => {
  return http.post("/template", data, {
    headers: authHeader()
  });
}

// get the previous templates
export const getPrevTemplates = () => {
  return http.get("/template", {
    headers: authHeader()
  });
}

export const deletePrevTemplate = (_id) => {
  return http.delete(`/template/${_id}`, {
    headers: authHeader()
  });
}

export const updateTemplate = (data) => {
  return http.post('/template/update', data, {
    headers: authHeader()
  });
}
