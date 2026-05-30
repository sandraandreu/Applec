import React from "react";
import "./App.scss";
import AppRoutes from "./routes/AppRoutes/AppRoutes";
import { AuthContextProvider } from "./context/auth/AuthContextProvider";
import { GroupContextProvider } from "./context/group/GroupContextProvider";
import ErrorBoundary from "./ui-kit/error-boundary/error-boundary";

const App: React.FC = () => (
  <ErrorBoundary>
    <AuthContextProvider>
      <GroupContextProvider>
        <div className="app">
          <main className="app__main">
            <AppRoutes />
          </main>
        </div>
      </GroupContextProvider>
    </AuthContextProvider>
  </ErrorBoundary>
);

export default App;
