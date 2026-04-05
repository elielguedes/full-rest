import api from "./api";

export async function login(username, password) {
  const response = await api.post("/auth/login", { username, password });
  if (response.data.access_token) {
    localStorage.setItem("token", response.data.access_token);
  }
  return response.data;
}
