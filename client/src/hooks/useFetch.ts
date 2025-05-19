// hooks/useFetch.ts
import { useEffect, useState } from "react";

function useFetch<T>(url: string | null) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!url) return;

        setLoading(true);
        setError(null);

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Något gick fel vid hämtning.");
                return res.json();
            })
            .then((data) => setData(data))
            .catch((err) => setError(err))
            .finally(() => setLoading(false));
    }, [url]);

    return { data, loading, error };
}

export default useFetch;
