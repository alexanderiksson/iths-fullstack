import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import type { User } from "../types/User";

export default function useAuth({ redirectToLogin = true } = {}) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get("/api/auth/check-auth", {
                    withCredentials: true,
                });

                if (response.data.loggedIn && response.data.user) {
                    setUser(response.data.user);
                    setError(null);
                } else {
                    setUser(null);
                    setError("Inte inloggad");
                    if (redirectToLogin) navigate("/login");
                }
            } catch (err) {
                console.error(err);
                setUser(null);
                setError(err);
                if (redirectToLogin) navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate, redirectToLogin]);

    return { user, loading, error };
}
