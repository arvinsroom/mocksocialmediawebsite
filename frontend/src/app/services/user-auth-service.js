import http from "../../http-common";

export const login = (templateId, qualtricsId) => {
  return http.post("/user/login", {
    templateId,
    qualtricsId
  })
    .then(response => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify({ accessToken: response.data.accessToken }));
      }
      return response.data;
    });
}

export const logout = () => {
  localStorage.removeItem("user");
};
