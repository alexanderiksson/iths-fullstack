import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";
import type { Post } from "../types/Post";

export default function Profile() {
    const navigate = useNavigate();

    const {
        user,
        loading: authLoading,
        error: authError,
    } = useAuth() as {
        user: User | null;
        loading: boolean;
        error: unknown;
    };

    const [posts, setPosts] = useState<Post[]>([]);
    const [fetchLoading, setFetchLoading] = useState(true);
    const [fetchError, setFetchError] = useState<unknown>(null);

    useEffect(() => {
        if (user) {
            setFetchLoading(true);
            fetch(`http://localhost:3000/posts/${user.id}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Något gick fel vid hämtning av inlägg.");
                    return res.json();
                })
                .then((data) => {
                    setPosts(data);
                    setFetchError(null);
                })
                .catch((err) => {
                    setFetchError(err);
                })
                .finally(() => {
                    setFetchLoading(false);
                });
        }
    }, [user]);

    if (!user && !authLoading) {
        navigate("/login");
        return null;
    }

    if (authLoading || fetchLoading) return <p>Laddar...</p>;
    if (authError || fetchError) return <p>Något gick fel</p>;

    return (
        <div className="content">
            <section className="flex flex-col gap-4 mb-8">
                <div className="flex">
                    <h1 className="text-3xl">{user?.username}</h1>
                </div>
                <div className="flex gap-4">
                    <span>
                        1 <span className="text-neutral-500">följare</span>
                    </span>
                    <span>
                        5 <span className="text-neutral-500">följer</span>
                    </span>
                </div>
            </section>

            <section>
                <h2 className="text-xl mb-4">Inlägg</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                className="p-4 border border-black/20 rounded-lg max-w-lg flex flex-col gap-2"
                            >
                                <span className="text-xs text-neutral-500">
                                    {new Date(post.created).toLocaleDateString()}
                                </span>
                                <p>{post.text}</p>
                            </div>
                        ))
                    ) : (
                        <p>Inga inlägg</p>
                    )}
                </div>
            </section>
        </div>
    );
}
