import http from "../../http-common";

export const create = (templateId, type, arr) => {
  return http.post("/questions", {
    templateId,
    type,
    pageQuestionArr: arr
  });
}
