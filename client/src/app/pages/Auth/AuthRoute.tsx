import LoadingPage from "@components/loading/LoadingPage";
import { useAuthStore } from "@store/useAuth.store";
import { FC } from "react";
import { Navigate, useLocation } from "react-router-dom";

const AuthRoute: FC = ({ children }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  if (!user) {
    // return <Navigate to="/landing" state={{ from: location }} replace />;
    return <LoadingPage />;
  }
  console.log(location);
  return <>{children}</>;
};

export default AuthRoute;
