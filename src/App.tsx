import { AppRoutes } from "@/app/router"
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
