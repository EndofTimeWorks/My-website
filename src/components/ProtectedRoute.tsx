/** not used */
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
    children: ReactNode;
}

/**
 * A wrapper component that protects routes requiring authentication
 * Redirects to login if user is not authenticated, preserving the intended destination
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const auth = useAuth();
    const location = useLocation();

    if (!auth.isAuthenticated) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
