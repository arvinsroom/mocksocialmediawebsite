import http from "../../http-common";
import authHeader from "./auth-header";

export const uploadSingleFile = (file, templateId) => {
  let formData = new FormData();

  formData.append("file", file);
  formData.append("templateId", templateId);

  return http.post("/upload/single", formData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    }
  });
}

// filesForm data include templateId data
export const uploadMultipleFiles = (filesFormData) => {
  return http.post("/upload/multiple", filesFormData, {
    headers: {
      ...authHeader(),
      "Content-Type": "multipart/form-data",
    }
  });
}
