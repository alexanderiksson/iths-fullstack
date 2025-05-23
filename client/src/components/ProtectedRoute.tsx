import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Loader from "./Loader";
import Error from "./Error";

export default function ProtectedRoute() {
    const { user, loading, error } = useAuth();

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <Error err="Fel vid autentisering" />;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
}
