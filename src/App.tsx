import React from "react";
import "./App.scss";
import AppRoutes from "./routes/appRoutes/AppRoutes";
import { AuthContextProvider } from "./context/auth/AuthContextProvider";

const App: React.FC = () => (
  <AuthContextProvider>
    <div className="app">
      <AppRoutes />
    </div>
  </AuthContextProvider>
);

export default App;
