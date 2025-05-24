export const getToken = (): string | null => {
  const token = localStorage.getItem("token");

  if (token) {
    return token;
  } else {
    return "";
  }
};
