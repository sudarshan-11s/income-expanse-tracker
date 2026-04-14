import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../context/auth-context";

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
