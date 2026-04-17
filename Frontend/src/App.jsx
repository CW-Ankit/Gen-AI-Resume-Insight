import { RouterProvider } from "react-router"
import { router } from "./appRoutes.jsx"
import { AuthProvider } from "./features/auth/authContext.jsx"

const App = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider >
  )
}

export default App