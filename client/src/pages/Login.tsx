import { useState, type FormEvent } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthForm from "../components/AuthForm";

export default function Login() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await axios.post(
                "/api/login",
                { username, password },
                {
                    withCredentials: true,
                }
            );

            navigate("/");
        } catch (err) {
            const axiosError = err as AxiosError;
            if (axiosError.response?.status === 401) {
                setError("Fel användarnamn eller lösenord");
            } else {
                setError("Något gick fel. Försök igen.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-sm p-8 bg-neutral-800 rounded-xl shadow-md flex flex-col gap-4">
                <h2 className="text-2xl font-semibold text-center">Logga in</h2>

                <AuthForm
                    username={username}
                    password={password}
                    onUsernameChange={(e) => setUsername(e.target.value)}
                    onPasswordChange={(e) => setPassword(e.target.value)}
                    onSubmit={handleLogin}
                    buttonText="Logga in"
                    error={error}
                    loading={loading}
                />

                <p className="text-sm">
                    Inget konto?{" "}
                    <Link to="/register" className="text-blue-500 underline">
                        Skapa konto
                    </Link>
                </p>
            </div>
        </div>
    );
}
