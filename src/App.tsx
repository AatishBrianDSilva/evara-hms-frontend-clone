import React from "react";
import "./App.css";
import AppRoutes from "./Routes/AppRoutes";
import { useSelector } from "react-redux";
import { RootState } from "./app/store"; // Adjust path as necessary
import TokenRefresher from "./components/Utils/TokenRefresher";

const App: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return (
    <>
      {isAuthenticated && (
        <>
          <TokenRefresher />
        </>
      )}
      <AppRoutes />
    </>
  );
};

export default App;
