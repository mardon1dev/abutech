import { Route, Routes } from "react-router-dom";
import PrivateRoute from "./helper/PrivateRoutes";
import React, { lazy } from "react";
import PrivateRouteAuth from "./helper/PrivateRouteAuth";
import NotFound from "./pages/NotFound";

const Login = lazy(() => import("./pages/Login"));
const Contracts = lazy(() => import("./pages/Contracts"));

const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRouteAuth>
            <Login />
          </PrivateRouteAuth>
        }
      />
      <Route
        path="/contracts"
        element={
          <PrivateRoute>
            <Contracts />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
