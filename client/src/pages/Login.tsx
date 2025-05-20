import { useState, type FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const { setUser } = useUser();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await axios.post(
                import.meta.env.VITE_SERVER_URL + "/login",
                { username, password },
                {
                    withCredentials: true,
                }
            );

            const res = await axios.get(import.meta.env.VITE_SERVER_URL + "/me", {
                withCredentials: true,
            });

            setUser(res.data);

            navigate("/");
        } catch (err) {
            const axiosError = err as AxiosError;
            if (axiosError.response?.status === 401) {
                setError("Fel användarnamn eller lösenord");
            } else {
                setError("Något gick fel. Försök igen.");
            }
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-sm p-8 bg-neutral-800 rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">Logga in</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-300">
                            Användarnamn
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-neutral-500 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-300">
                            Lösenord
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-neutral-500 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-primary rounded-md cursor-pointer"
                    >
                        Logga in
                    </button>
                </form>
            </div>
        </div>
    );
}
