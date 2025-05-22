import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";

export default function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("/api/check-auth", {
                    withCredentials: true,
                });

                if (response.data.loggedIn && response.data.user) {
                    setUser(response.data.user);
                    setError(null);
                } else {
                    setUser(null);
                    setError("Inte inloggad");
                    navigate("/login");
                }
            } catch (err) {
                console.error(err);
                setUser(null);
                setError(err);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    return { user, loading, error };
}
