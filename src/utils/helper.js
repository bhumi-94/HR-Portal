
const getAuthData = () => {
  const token =
    localStorage.getItem("token") ||
    sessionStorage.getItem("token");

  const user =
    JSON.parse(localStorage.getItem("user")) ||
    JSON.parse(sessionStorage.getItem("user"));

  return { token, user };
};

export default getAuthData;