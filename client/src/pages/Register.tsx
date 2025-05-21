import { useState, type FormEvent } from "react";
import AuthForm from "../components/AuthForm";
import { Link } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { setUser } = useUser();

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            await axios.post(
                "/api/register",
                { username, password },
                {
                    withCredentials: true,
                }
            );

            const res = await axios.get("/api/me", {
                withCredentials: true,
            });

            setUser(res.data);
            setLoading(false);

            navigate("/");
        } catch (err) {
            const axiosError = err as AxiosError;
            if (axiosError.response?.status === 409) {
                setError("Användarnamnet är upptaget");
            } else {
                setError("Något gick fel. Försök igen.");
            }
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full max-w-sm p-8 bg-neutral-800 rounded-xl shadow-lg flex flex-col gap-8">
                <h2 className="text-2xl font-semibold text-center">Skapa konto</h2>

                <AuthForm
                    username={username}
                    password={password}
                    onUsernameChange={(e) => setUsername(e.target.value)}
                    onPasswordChange={(e) => setPassword(e.target.value)}
                    onSubmit={handleRegister}
                    buttonText="Skapa konto"
                    error={error}
                    loading={loading}
                />

                <p className="text-sm">
                    Har du redan ett konto?{" "}
                    <Link to="/login" className="text-blue-500 underline">
                        Logga in
                    </Link>
                </p>
            </div>
        </div>
    );
}
