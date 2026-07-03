import axios from "axios";

const http = axios.create({
  baseURL: "/api",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.detail ||
      err?.message ||
      "Unexpected error.";
    return Promise.reject(new Error(msg));
  }
);

export const planRoute    = (start, finish) => http.post("/route/",    { start, finish }).then((r) => r.data);
export const getHealth    = ()              => http.get("/health/").then((r) => r.data);
export const getStations  = ()              => http.get("/stations/").then((r) => r.data);
