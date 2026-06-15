import React from "react";
import "./App.scss";
import AppRoutes from "./routes/AppRoutes/AppRoutes";
import { AuthContextProvider } from "./context/auth/AuthContextProvider";
import { GroupContextProvider } from "./context/group/GroupContextProvider";
import { NotificationsContextProvider } from "./context/notifications/NotificationsContextProvider";
import ErrorBoundary from "./ui-kit/error-boundary/error-boundary";

const App: React.FC = () => (
  <ErrorBoundary>
    <AuthContextProvider>
      <GroupContextProvider>
        <NotificationsContextProvider>
          <div className="app">
            <main className="app__main">
              <AppRoutes />
            </main>
          </div>
        </NotificationsContextProvider>
      </GroupContextProvider>
    </AuthContextProvider>
  </ErrorBoundary>
);

export default App;
