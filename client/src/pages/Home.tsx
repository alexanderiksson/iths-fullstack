import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface User {
    username: string;
}

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
            <h1 className="text-2xl font-bold">Välkommen, {user?.username}</h1>
        </div>
    );
}
