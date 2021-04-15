import http from "../../http-common";
import authHeader from "./auth-header";

export const getAdminTemplatesWithUserCount = () => {
  return http.get("/metrics/templates/allusers/counts", {
    headers: authHeader()
  });
}

export const fetchTemplateData = (templateId) => {
  let url = '';
  if (templateId) url = `/metrics/allusers/${templateId}`;
  else url = "/metrics/allusers";
  return http.get(url, {
    headers: authHeader()
  });
}
