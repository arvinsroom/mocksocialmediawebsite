import http from "../../http-common";
import authHeader from "./auth-header";

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

export const verifyAdmin = () => {
  return http.get("/admin/", {
    headers: authHeader(),
  });
}

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem('user'));
}
