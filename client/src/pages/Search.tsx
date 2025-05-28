import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { User } from "../types/User";
import Loader from "../components/Loader";
import { IoSearch } from "react-icons/io5";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query) return;

        setLoading(true);

        try {
            const response = await axios.get(`/api/users/search-users?query=${query}`);
            setResults(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="content">
            <h1 className="text-2xl mb-4">Sök</h1>

            <div>
                <div className="w-full flex relative">
                    <IoSearch className="absolute left-4 top-1/2 -translate-y-1/2" color="gray" />
                    <input
                        type="text"
                        placeholder="Sök"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleSearch();
                        }}
                        className="bg-neutral-800/50 px-10 py-2 border border-neutral-500/10 rounded-lg shadow-sm placeholder:text-sm flex-1 "
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
