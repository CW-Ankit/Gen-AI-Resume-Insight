import { createBrowserRouter } from "react-router";
import Login from "./features/auth/pages/login.jsx";
import Register from "./features/auth/pages/Register.jsx";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path:"/",
    element:<h1>Home Page</h1>
  }
])