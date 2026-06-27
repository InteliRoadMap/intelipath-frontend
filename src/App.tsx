import { AppRoutes } from "@/routes"
import { GlobalLoadingBar } from "@/components"

function App() {
  return (
    <>
      <GlobalLoadingBar />
      <AppRoutes />
    </>
  )
}

export default App
