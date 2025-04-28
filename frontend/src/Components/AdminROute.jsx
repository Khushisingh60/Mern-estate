import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const role = localStorage.getItem('role'); // Get role from localStorage

  return role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;
