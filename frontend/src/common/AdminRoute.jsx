import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
  const user = useSelector((state) => state.user);

  if (!user.isAuthenticated || !user.token) {
    return <Navigate to="/login" />;
  }

  if (user.user?.role !== "admin") {
    return <Navigate to="/dress" />;
  }

  return <Outlet />;
};

export default AdminRoute;
