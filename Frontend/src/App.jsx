import { RouterProvider } from "react-router"
import { router } from "./appRoutes.jsx"

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App