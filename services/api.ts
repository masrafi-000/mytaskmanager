import axios from "axios";

const API_URL = "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  signup: (userData: {
    name: string;
    email: string;
    password: string;
    repeatPassword: string;
  }) => api.post("/api/auth/sign-up", userData),
  login: (userData: { email: string; password: string }) =>
    api.post("/api/auth/login", userData),
};

// Todo API endpoints
export const todoAPI = {
  createTodo: (todoData: {
    title: string;
    desc: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
    project?: string;
    tags?: string[];
  }) => api.post("/user/todo", todoData),
  getTodos: () => api.get("/user/todo"),
  updateTodo: (
    id: string,
    todoData: {
      title: string;
      desc: string;
      priority: "low" | "medium" | "high";
      dueDate: string;
      project?: string;
      tags?: string[];
    }
  ) => api.put(`/user/todo/${id}`, todoData),
  deleteTodo: (id: string) => api.delete(`/user/todo/${id}`),
};

export default api;
