import useFetch from "../hooks/useFetch";
import type { User } from "../types/User";
import PostCard from "../components/PostCard";
import ProfileHead from "../components/ProfileHead";
import Loader from "../components/Loader";
import Error from "../components/Error";

export default function Profile() {
    const { data: user, loading, error } = useFetch<User>("/api/users/me");

    const {
        data: profile,
        loading: profileLoading,
        error: profileError,
    } = useFetch<User>(user ? `/api/users/user/${user.id}` : null);

    if (loading || profileLoading) return <Loader />;
    if (error || profileError || !profile) return <Error />;

    return (
        <div className="content">
            <ProfileHead
                userId={profile.id}
                username={profile.username}
                profilePicture={profile.profile_picture ?? "/profileplaceholder.jpg"}
                followers={profile.followers}
                follows={profile.follows}
                posts={profile.posts}
                isCurrentUser
            />

            <section>
                <h2 className="text-xl mb-4">Inlägg</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(profile.posts) && profile.posts.length > 0 ? (
                        profile.posts
                            .slice()
                            .reverse()
                            .map((post, index) => (
                                <PostCard
                                    key={index}
                                    date={post.created}
                                    text={post.text}
                                    user={{
                                        id: profile.id,
                                        username: profile.username,
                                        profile_picture:
                                            profile.profile_picture ?? "/profileplaceholder.jpg",
                                    }}
                                    liked={post.likes.includes(profile.id) ?? false}
                                    postId={post.id}
                                    likesCount={post.likes.length ?? 0}
                                    comments={post.comments}
                                    currentUserId={profile.id}
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
