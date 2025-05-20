import { useEffect, useState } from "react";
import axios from "axios";

export default function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get(import.meta.env.VITE_SERVER_URL + "/check-auth", {
                    withCredentials: true,
                });

                if (response.data.loggedIn) {
                    setUser(response.data.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                setError(err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { user, loading, error };
}
