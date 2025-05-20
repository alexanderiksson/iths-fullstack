import type { Post } from "../types/Post";
import FollowButton from "./FollowButton";
import axios from "axios";

interface ProfileProps {
    userId: number | undefined;
    username: string | undefined;
    followers: number[] | undefined;
    follows: number[] | undefined;
    posts: Post[] | undefined;
    follow?: boolean;
    isCurrentUser?: boolean;
}

export default function ProfileHead({
    userId,
    username,
    followers,
    follows,
    posts,
    follow,
    isCurrentUser,
}: ProfileProps) {
    const handleLogOut = async () => {
        try {
            await axios.post(
                "http://localhost:3000/logout",
                {},
                {
                    withCredentials: true,
                }
            );

            window.location.href = "/login";
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <section className="flex flex-col gap-4 mb-8 pb-4 border-b border-neutral-800">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl">{username}</h1>
                {isCurrentUser && (
                    <button className="cursor-pointer" onClick={handleLogOut}>
                        Logga ut
                    </button>
                )}
            </div>

            <div className="flex gap-4">
                <span>
                    {followers?.length} <span className="text-neutral-400">följare</span>
                </span>
                <span>
                    {follows?.length} <span className="text-neutral-400">följer</span>
                </span>
                <span>
                    {posts?.length} <span className="text-neutral-400">Inlägg</span>
                </span>
            </div>

            {!isCurrentUser && (
                <div>
                    <FollowButton targetUserId={userId} initialIsFollowing={follow} />
                </div>
            )}
        </section>
    );
}
