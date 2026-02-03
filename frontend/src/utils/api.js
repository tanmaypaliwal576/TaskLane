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

export const managertasks = async () => {
  const token = localStorage.getItem("tasklane_token");

  const res = await api.get("/manager/mytasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const getallusers = async () => {
  const token = localStorage.getItem("tasklane_token");

  const res = await api.get("/manager/allusers", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const createtask = async (data) => {
  const token = localStorage.getItem("tasklane_token");

  const res = await api.post("/manager/create", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


export const getallmanagertasks = async () => {
  const token = localStorage.getItem("tasklane_token");

  const res = await api.get("/manager/mytasks", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

return res.data;
}


export const contact = async (data) => {
  const token = localStorage.getItem("tasklane_token");
  const res = await api.post("/contact", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });  //send data to backend

  return res.data; //send response back to frontend
}


export const updatetask = async (id , status) => {
  const token = localStorage.getItem("tasklane_token");

  const res = await api.patch(`/users/${id}/status`, {status} , {
    headers: {Authorization : `Bearer ${token}`}
  });


  return res.data;
}

export default api;
