import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import type { User } from "../types/User";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import ProfileHead from "../components/ProfileHead";

export default function Profile() {
    const {
        user,
        loading: authLoading,
        error: authError,
    } = useAuth() as {
        user: User | null;
        loading: boolean;
        error: unknown;
    };

    const {
        data: userData,
        loading: userLoading,
        error: userError,
    } = useFetch<User>(user ? `/api/user/${user.id}` : null);

    if (authLoading || userLoading) return <Loader />;
    if (authError || userError) {
        console.error(authError, userError);
        return <p>Något gick fel</p>;
    }

    return (
        <div className="content">
            <ProfileHead
                userId={userData?.id}
                username={userData?.username}
                followers={userData?.followers}
                follows={userData?.follows}
                posts={userData?.posts}
                isCurrentUser
            />

            <section>
                <h2 className="text-xl mb-4">Inlägg</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(userData?.posts) && userData.posts.length > 0 ? (
                        userData.posts
                            .slice()
                            .reverse()
                            .map((post, index) => (
                                <PostCard
                                    key={index}
                                    date={post.created}
                                    text={post.text}
                                    user={{
                                        id: userData.id,
                                        username: userData.username,
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
