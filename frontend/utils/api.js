import axios from "axios";

const getBaseURL = () => {
  if (typeof window === "undefined") {
    // SSR or Node.js (inside Docker)
    return process.env.NEXT_PUBLIC_API_URL || "http://backend:3000";
  }
  // In the browser: use localhost, since 'backend' is not resolvable
  return "http://localhost:3000";
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true, // if you use cookies/sessions
});

export default api;
