import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

export default function Home() {
    const { user, loading, error } = useAuth() as {
        user: User | null;
        loading: boolean;
        error: unknown;
    };
    const navigate = useNavigate();

    if (loading) return <p>Laddar...</p>;
    if (error) return <p>Fel vid autentisering</p>;
    if (!user) navigate("/login");

    return (
        <div className="content">
            <h1 className="text-4xl font-bold">Välkommen, {user?.username}</h1>
            <p>Ditt flöde är tomt</p>
        </div>
    );
}
