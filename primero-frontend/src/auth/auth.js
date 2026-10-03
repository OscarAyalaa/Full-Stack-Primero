export const isAuthenticated = () => !!localStorage.getItem("token");

export const getUser = () =>
  JSON.parse(localStorage.getItem("user") || "null");

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
