import http from "../../http-common";

export const login = (username, password) => {
  return http.post("/admin/login", {
    username,
    password
  })
    .then(response => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
}

export const logout = () => {
  localStorage.removeItem("user");
};
