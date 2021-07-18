import http from "../../http-common";
import authHeader from "./auth-header";

export const getAdminTemplatesWithUserCount = () => {
  return http.get("/metrics/templates/allusers/counts", {
    headers: authHeader()
  });
}

// export const fetchTemplateData = (templateId) => {
//   return http.get(`/metrics/allusers/${templateId}`, {
//     headers: authHeader()
//   });
// }

export const fetchTemplateDataAllUser = (templateId, limit, offset) => {
  return http.get(`/metrics/allusers/${templateId}/${limit}/${offset}`, {
    headers: authHeader()
  });
}

export const fetchTemplateDataSocialMedia = (templateId) => {
  return http.get(`/metrics/allusers/socialmedia/${templateId}`, {
    headers: authHeader()
  });
}

export const fetchTemplateDataQuestionData = (templateId) => {
  return http.get(`/metrics/allusers/question/${templateId}`, {
    headers: authHeader()
  });
}

export const downloadMediaData = (templateId) => {
  return http.get(`/metrics/allUsers/allMedia/${templateId}`, {
    headers: authHeader()
  });
}
