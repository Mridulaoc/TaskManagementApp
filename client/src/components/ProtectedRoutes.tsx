import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { Navigate, useLocation } from "react-router-dom";

interface IProtectedRouteProps {
  children: React.ReactNode;
}
export const UserProtectedRoute = ({ children }: IProtectedRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.user.isAuthenticated
  );
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

export const AdminProtectedRoute = ({ children }: IProtectedRouteProps) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.admin.isAuthenticated
  );
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
};
