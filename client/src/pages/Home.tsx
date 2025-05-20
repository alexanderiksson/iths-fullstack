import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import type { User } from "../types/User";
import useFetch from "../hooks/useFetch";
import PostCard from "../components/PostCard";
import type { Post } from "../types/Post";
import Loader from "../components/Loader";
import { Link } from "react-router-dom";

export default function Home() {
    const { user, loading, error } = useAuth() as {
        user: User | null;
        loading: boolean;
        error: unknown;
    };
    const {
        data: feed,
        loading: feedLoading,
        error: feedError,
    } = useFetch<Post[]>("http://localhost:3000/feed");

    const navigate = useNavigate();

    if (loading || feedLoading) return <Loader />;
    if (error || feedError) return <p>Något gick fel</p>;
    if (!user) navigate("/login");

    return (
        <div className="content">
            <h1 className="text-2xl mb-4">Välkommen, {user?.username}</h1>

            <Link
                to="/new-post"
                className="inline-flex bg-primary py-2 px-6 rounded-lg text-white cursor-pointer mb-12"
            >
                Nytt inlägg
            </Link>

            {!feed || feed.length === 0 ? (
                <p className="text-neutral-500">Ditt flöde är tomt</p>
            ) : (
                <>
                    <p className="mb-2 text-lg">Ditt flöde</p>
                    <div className="flex flex-col gap-4">
                        {Array.isArray(feed) &&
                            feed.map((post, index) => (
                                <PostCard
                                    key={index}
                                    date={post.created}
                                    text={post.text}
                                    user={{ id: post.user_id, username: post.username }}
                                />
                            ))}
                    </div>
                </>
            )}
        </div>
    );
}
