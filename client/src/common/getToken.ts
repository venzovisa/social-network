export const getToken = (): string => {
  const token = localStorage.getItem("token");

  if (token && token !== null) {
    return token;
  } else {
    return "";
  }
};
