import { Link } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { Post } from "../types/Post";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import Error from "../components/Error";

export default function Home() {
    const { data: feed, loading, error } = useFetch<Post[]>("/api/feed");

    if (loading) return <Loader />;
    if (error) return <Error />;

    return (
        <div className="content">
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
