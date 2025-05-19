import { useEffect, useState } from "react";
import axios from "axios";

export default function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        axios
            .get<T>(url)
            .then((response) => setData(response.data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, error, loading };
}
