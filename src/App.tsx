import { AppRoutes } from "@/routes"
import { GlobalLoadingBar, GlobalToast } from "@/components/ui"

function App() {
  return (
    <>
      <GlobalLoadingBar />
      <GlobalToast />
      <AppRoutes />
    </>
  )
}

export default App
