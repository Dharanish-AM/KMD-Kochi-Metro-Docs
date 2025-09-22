// utils/auth.js

// Save token
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

// Get token
export const getToken = () => {
  return localStorage.getItem("token");
};

// Remove token (for logout)
export const removeToken = () => {
  localStorage.removeItem("token");
};

// Save user data
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get user data
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Remove user data
export const removeUser = () => {
  localStorage.removeItem("user");
};

// Save user type
export const setUserType = (userType) => {
  localStorage.setItem("userType", userType);
};

// Get user type
export const getUserType = () => {
  return localStorage.getItem("userType");
};

// Remove user type
export const removeUserType = () => {
  localStorage.removeItem("userType");
};

// Clear all auth data (for logout)
export const clearAuthData = () => {
  removeToken();
  removeUser();
  removeUserType();
};
