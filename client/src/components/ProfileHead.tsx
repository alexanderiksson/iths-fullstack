import type { Post } from "../types/Post";
import FollowButton from "./FollowButton";
import { FollowlistModal } from "./Modals";
import { useState } from "react";
import { Link } from "react-router-dom";
import { IoIosSettings } from "react-icons/io";

interface ProfileProps {
    userId: number;
    username: string;
    profilePicture: string | undefined;
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
    profilePicture,
    followers,
    follows,
    posts,
    follow,
    isCurrentUser,
    currentUser,
}: ProfileProps) {
    const [followersIsOpen, setFollowersIsOpen] = useState(false);
    const [followsIsOpen, setFollowsIsOpen] = useState(false);

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
                    <img
                        src={profilePicture}
                        width={80}
                        height={80}
                        className="rounded-full object-cover"
                        style={{
                            width: 80,
                            height: 80,
                            minWidth: 80,
                            minHeight: 80,
                            maxWidth: 80,
                            maxHeight: 80,
                        }}
                        alt="Profil bild"
                    />
                    <div className="flex flex-col gap-4 w-full overflow-hidden">
                        <div className="flex items-center gap-2">
                            <h1 className="text-3xl truncate">{username}</h1>
                            {isCurrentUser && (
                                <Link to="/profile/edit" className="shrink-0">
                                    <IoIosSettings size={24} color="gray" />
                                </Link>
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
