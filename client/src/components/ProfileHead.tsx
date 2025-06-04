import type { Post } from "../types/Post";
import FollowButton from "./FollowButton";
import { FollowlistModal } from "./Modals";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ProfileProps {
    userId: number | undefined;
    username: string | undefined;
    followers: number[] | undefined;
    follows: number[] | undefined;
    posts: Post[] | undefined;
    follow?: boolean;
    isCurrentUser?: boolean;
    currentUser?: number;
}

export default function ProfileHead({
    userId,
    username,
    followers,
    follows,
    posts,
    follow,
    isCurrentUser,
    currentUser,
}: ProfileProps) {
    const [followersIsOpen, setFollowersIsOpen] = useState(false);
    const [followsIsOpen, setFollowsIsOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogOut = async () => {
        try {
            await axios.post(
                "/api/auth/logout",
                {},
                {
                    withCredentials: true,
                }
            );

            navigate("/login");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <FollowlistModal
                isOpen={followersIsOpen}
                onClose={() => setFollowersIsOpen(false)}
                fetchUrl={`/api/users/followers/${userId}`}
                label="Följare"
            />
            <FollowlistModal
                isOpen={followsIsOpen}
                onClose={() => setFollowsIsOpen(false)}
                fetchUrl={`/api/users/follows/${userId}`}
                label="Följer"
            />

            <section className="flex flex-col gap-8 mb-8 pb-6 border-b border-neutral-800">
                <div className="flex items-center gap-8">
                    <img src="/profileplaceholder.jpg" width={80} className="rounded-full" alt="" />
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex justify-between">
                            <h1 className="text-3xl">{username}</h1>

                            {isCurrentUser && (
                                <button className="button" onClick={handleLogOut}>
                                    Logga ut
                                </button>
                            )}
                        </div>

                        <div className="flex gap-4">
                            <span
                                className="cursor-pointer"
                                onClick={() => setFollowersIsOpen(true)}
                            >
                                {followers?.length}{" "}
                                <span className="text-neutral-400">följare</span>
                            </span>
                            <span className="cursor-pointer" onClick={() => setFollowsIsOpen(true)}>
                                {follows?.length} <span className="text-neutral-400">följer</span>
                            </span>
                            <span>
                                {posts?.length} <span className="text-neutral-400">Inlägg</span>
                            </span>
                        </div>
                    </div>
                </div>

                {!isCurrentUser && (
                    <div>
                        <FollowButton
                            userId={currentUser}
                            targetUserId={userId}
                            initialIsFollowing={follow}
                        />
                    </div>
                )}
            </section>
        </>
    );
}
