import http from "../../http-common";
import authHeader from "./auth-header";

export const getAdminTemplatesWithUserCount = () => {
  return http.get("/metrics/templates/allusers/counts", {
    headers: authHeader()
  });
}

export const fetchTemplateData = (templateId) => {
  return http.get(`/metrics/allusers/${templateId}`, {
    headers: authHeader()
  });
}

export const downloadMediaData = (templateId) => {
  return http.get(`/metrics/allUsers/allMedia/${templateId}`, {
    headers: authHeader()
  });
}
