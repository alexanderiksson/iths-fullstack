import useFetch from "../hooks/useFetch";
import type { Post } from "../types/Post";
import type { User } from "../types/User";
import PostCard from "../components/PostCard";
import Loader from "../components/Loader";
import Error from "../components/Error";

export default function Home() {
    const { data: user } = useFetch<User>("/api/users/me");
    const { data: feed, loading, error } = useFetch<Post[]>("/api/posts/feed");

    if (loading) return <Loader />;
    if (error || !user) return <Error />;

    return (
        <div className="content">
            {!feed || feed.length === 0 ? (
                <p className="text-neutral-500">Ditt flöde är tomt</p>
            ) : (
                <>
                    <p className="mb-2 text-lg">Ditt flöde</p>
                    <div className="flex flex-col gap-4">
                        {Array.isArray(feed) &&
                            [...feed]
                                .sort(
                                    (a, b) =>
                                        new Date(b.created).getTime() -
                                        new Date(a.created).getTime()
                                )
                                .map((post, index) => (
                                    <PostCard
                                        key={index}
                                        date={post.created}
                                        text={post.text}
                                        user={{ id: post.user_id, username: post.username }}
                                        liked={post.likes?.includes(user.id) ?? false}
                                        postId={post.id}
                                        likesCount={post.likes?.length ?? 0}
                                        comments={post.comments}
                                        currentUserId={user.id}
                                    />
                                ))}
                    </div>
                </>
            )}
        </div>
    );
}
