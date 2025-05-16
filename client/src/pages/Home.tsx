import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const { user, loading, error } = useAuth();
    const navigate = useNavigate();

    if (loading) return <p>Laddar...</p>;
    if (error) return <p>Fel vid autentisering</p>;
    if (!user) navigate("/login");

    return <div>Välkommen</div>;
}
