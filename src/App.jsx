import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { AuthContextProvider } from "./contexts/AuthContext";

const App = () => {
  return (
    <>
      
      <AuthContextProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </AuthContextProvider>
    </>
  )
}

export default App;