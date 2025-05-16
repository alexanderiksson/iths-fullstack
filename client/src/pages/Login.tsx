import { useState } from "react";
import type { FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const res = await axios.post(
                "http://localhost:3000/login",
                { username, password },
                {
                    withCredentials: true,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );

            if (res.status === 200) {
                navigate("/");
            }
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
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-md">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    Logga in
                </h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Användarnamn
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Lösenord
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200"
                        />
                    </div>

                    {error && <p className="text-sm text-red-600">{error}</p>}

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                    >
                        Logga in
                    </button>
                </form>
            </div>
        </div>
    );
}
