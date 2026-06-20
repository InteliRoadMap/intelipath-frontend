import { AppRoutes } from "@/routes"
import { GlobalLoadingBar } from "@/components/ui"

function App() {
  return (
    <>
      <GlobalLoadingBar />
      <AppRoutes />
    </>
  )
}

export default App
