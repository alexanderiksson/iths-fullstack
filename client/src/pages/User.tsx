import { useParams } from "react-router-dom";
import useFetch from "../hooks/useFetch";
import type { User } from "../types/User";
import PostCard from "../components/PostCard";
import ProfileHead from "../components/ProfileHead";
import Loader from "../components/Loader";
import Error from "../components/Error";

export default function User() {
    const { id } = useParams();

    const {
        data: user,
        loading: userLoading,
        error: userError,
    } = useFetch<User>(`/api/user/${id}`);

    const {
        data: currentUser,
        loading: currentUserLoading,
        error: currentUserError,
    } = useFetch<User>("/api/me");

    if (userLoading || currentUserLoading) return <Loader />;
    if (userError || currentUserError || !user) return <Error />;

    const isFollowing = user.followers?.includes(currentUser!.id) ?? false;

    return (
        <div className="content">
            <ProfileHead
                userId={user.id}
                username={user.username}
                followers={user.followers}
                follows={user.follows}
                posts={user.posts}
                follow={isFollowing}
                isCurrentUser={user.id === currentUser!.id}
                currentUser={currentUser!.id}
            />

            <section>
                <h2 className="text-xl mb-4">Inlägg</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(user.posts) && user.posts.length > 0 ? (
                        user.posts
                            .slice()
                            .reverse()
                            .map((post, index) => (
                                <PostCard
                                    key={index}
                                    date={post.created}
                                    text={post.text}
                                    user={{
                                        id: user.id,
                                        username: user.username,
                                    }}
                                />
                            ))
                    ) : (
                        <p className="text-neutral-500">Inga inlägg</p>
                    )}
                </div>
            </section>
        </div>
    );
}
