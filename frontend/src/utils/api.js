import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ✅ LOGIN
export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

// ✅ SIGNUP
export const signupUser = async (data) => {
  const res = await api.post("/auth/signup", data);
  return res.data;
};

export const gettasks = async () => {
  const token = localStorage.getItem("tasklane_token");

  const res = await api.get("/users/mytasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export default api;
