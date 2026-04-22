import React from "react";
import "./App.scss";
import AppRoutes from "./routes/AppRoutes/AppRoutes";
import { AuthContextProvider } from "./context/auth/AuthContextProvider";
import { GroupContextProvider } from "./context/group/GroupContextProvider";

const App: React.FC = () => (
  <AuthContextProvider>
    <GroupContextProvider>
      <div className="app">
        <AppRoutes />
      </div>
    </GroupContextProvider>
  </AuthContextProvider>
);

export default App;
