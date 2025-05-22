import { useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import type { User } from "../types/User";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard";
import ProfileHead from "../components/ProfileHead";

export default function User() {
    const { id } = useParams();

    const { user: authUser, loading: authLoading, error: authError } = useAuth();

    const {
        data: profileData,
        loading: profileLoading,
        error: profileError,
    } = useFetch<User>(authUser ? `/api/user/${id}` : null);

    if (authLoading || profileLoading) return <Loader />;
    if (authError || profileError) {
        console.error(authError, profileError);
        return <p>Något gick fel</p>;
    }

    if (!profileData) return <p>Profil hittades inte</p>;

    const isFollowing = profileData.followers?.includes(authUser!.id) ?? false;

    return (
        <div className="content">
            <ProfileHead
                userId={profileData.id}
                username={profileData.username}
                followers={profileData.followers}
                follows={profileData.follows}
                posts={profileData.posts}
                follow={isFollowing}
                isCurrentUser={profileData.id === authUser!.id}
                currentUser={authUser!.id}
            />

            <section>
                <h2 className="text-xl mb-4">Inlägg</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(profileData.posts) && profileData.posts.length > 0 ? (
                        profileData.posts
                            .slice()
                            .reverse()
                            .map((post, index) => (
                                <PostCard
                                    key={index}
                                    date={post.created}
                                    text={post.text}
                                    user={{
                                        id: profileData.id,
                                        username: profileData.username,
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
