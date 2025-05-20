import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import type { User } from "../types/User";

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    loading: boolean;
    error: unknown;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const {
        user: authUser,
        loading: authLoading,
        error: authError,
    } = useAuth() as {
        user: User | null;
        loading: boolean;
        error: unknown;
    };
    const userId = authUser?.id ?? null;

    const {
        data,
        loading: userLoading,
        error: userError,
    } = useFetch<User>(userId ? `/api/user/${userId}` : null);

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (data) {
            setUser(data);
        }
    }, [data]);

    const loading = authLoading || userLoading;
    const error = authError || userError;

    return (
        <UserContext.Provider value={{ user, setUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser måste användas inom en <UserProvider>");
    }
    return context;
}
