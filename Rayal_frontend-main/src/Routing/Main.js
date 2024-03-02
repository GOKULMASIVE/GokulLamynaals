import React from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import routes from "./Routes";
import { Suspense } from "react";
const Router = () => {
  const PrivateRoute = ({ children }) => {
    let location = useLocation();
    const token = localStorage.getItem("token");

    if (!token) {
      return <Navigate to="/login" state={{ from: location }} />;
    }
    return children;
  };

  const CommonRoute = ({ children }) => {
    return children;
  };

  return (
    <Suspense
      fallback={
        <div className="row vh-100 align-items-center justify-content-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
    >
      <Routes>
        {routes.map(
          (
            { element: Component, path, isAuthenticated, isCommon, ...rest },
            i
          ) => {
            return (
              <Route
                key={i}
                path={path}
                element={
                  isAuthenticated ? (
                    <PrivateRoute>
                      <Component />
                    </PrivateRoute>
                  ) : (
                    <CommonRoute>
                      <Component />
                    </CommonRoute>
                  )
                }
              />
            );
          }
        )}
      </Routes>
    </Suspense>
  );
};

export default Router;
