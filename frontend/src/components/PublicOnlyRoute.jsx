import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "./Loading";

export default function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) return <Loading text="Checking your session..." />;
  if (user) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
