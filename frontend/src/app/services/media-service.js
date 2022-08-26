import http from "../../http-common";
import authHeader from "./auth-header";

export const create = (data) => {
  return http.post("/media", data, {
    headers: authHeader()
  });
}

// filesForm data include templateId data
export const uploadMultipleFiles = (filesFormData) => {
  return http.post("/media/upload/multiple", filesFormData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    }
  });
}

export const uploadMultipleAuthourFiles = (filesFormData) => {
  return http.post("/media/upload/multiple/authors", filesFormData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    }
  });
}