export const useAuth = () => {
  const token = (localStorage.getItem("token") || sessionStorage.getItem("token"));

  return {
    token,
    isAuthenticated: !!token,
  };
};


									