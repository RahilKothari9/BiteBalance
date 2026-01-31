import { BrowserRouter } from "react-router-dom";
import { Router } from "./Router";
import { AuthContextProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";

const App = () => {
  return (
    <AuthContextProvider>
      <ToastProvider>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </ToastProvider>
    </AuthContextProvider>
  );
};

export default App;
