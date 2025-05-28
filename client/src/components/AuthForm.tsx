interface AuthFormProps {
    username: string;
    password: string;
    onUsernameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    buttonText: string;
    error?: string | null;
    loading?: boolean;
}

export default function AuthForm({
    username,
    password,
    onUsernameChange,
    onPasswordChange,
    onSubmit,
    buttonText,
    error,
    loading,
}: AuthFormProps) {
    return (
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-neutral-300">Användarnamn</label>
                <input
                    className="mt-1 bg-neutral-900/20 w-full px-4 py-2 border border-white/10 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                    type="text"
                    value={username}
                    onChange={onUsernameChange}
                    required
                    autoComplete="username"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-neutral-300">Lösenord</label>
                <input
                    className="mt-1 bg-neutral-900/20 w-full px-4 py-2 border border-white/10 rounded-lg shadow-sm focus:ring focus:ring-blue-200"
                    type="password"
                    value={password}
                    onChange={onPasswordChange}
                    required
                    autoComplete="current-password"
                />
            </div>

            {error && <p className="text-sm text-error">{error}</p>}

            <button
                type="submit"
                className="w-full py-2 px-4 bg-primary rounded-md cursor-pointer flex justify-center items-center gap-2"
            >
                {loading && (
                    <div className="w-4 h-4 border-2 border-t-white border-gray-400 rounded-full animate-spin"></div>
                )}
                {buttonText}
            </button>
        </form>
    );
}
