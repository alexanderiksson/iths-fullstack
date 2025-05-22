import { useState } from "react";
import axios from "axios";
import type { User } from "../types/User";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query) return;
        setLoading(true);

        try {
            const response = await axios.get(`/api/search-users?query=${query}`);
            setResults(response.data);
        } catch (err) {
            console.error(err);
        }

        setLoading(false);
    };

    return (
        <div className="content">
            <h1 className="text-2xl mb-4">Sök</h1>

            <div>
                <div className="w-full flex">
                    <input
                        type="text"
                        placeholder="Sök"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleSearch();
                        }}
                        className="bg-neutral-800/50 px-4 py-2 border border-neutral-500/10 rounded-lg shadow-sm placeholder:text-sm flex-1"
                    />
                </div>
                <ul className="flex flex-col mt-4 divide-y divide-neutral-700">
                    {!loading ? (
                        results.length > 0 ? (
                            results.map((user, index) => (
                                <Link to={`/u/${user.id}`}>
                                    <li className="py-3 px-2 flex items-center gap-2" key={index}>
                                        <img
                                            src="/profileplaceholder.jpg"
                                            width={32}
                                            className="rounded-full"
                                            alt="Profil bild"
                                        />
                                        {user.username}
                                    </li>
                                </Link>
                            ))
                        ) : (
                            query && <p>Inga resultat</p>
                        )
                    ) : (
                        <Loader />
                    )}
                </ul>
            </div>
        </div>
    );
}
