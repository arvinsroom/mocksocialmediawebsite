import http from "../../http-common";

export const login = (templateId) => {
  return http.post("/user/login", {
    templateId,
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
