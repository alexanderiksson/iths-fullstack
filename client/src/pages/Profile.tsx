import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

export default function Profile() {
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
            <section className="flex flex-col gap-4">
                <div className="flex">
                    <h1 className="text-3xl">{user?.username}</h1>
                </div>
                <div className="flex gap-4">
                    <span>
                        1 <span className="text-neutral-500">följare</span>
                    </span>
                    <span>
                        5 <span className="text-neutral-500">följer</span>
                    </span>
                </div>
            </section>
        </div>
    );
}
