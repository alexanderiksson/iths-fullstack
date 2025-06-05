import { BsThreeDots } from "react-icons/bs";
import { FaHeart, FaComment } from "react-icons/fa6";
import { Link } from "react-router-dom";
import useToggleLike from "../hooks/useToggleLike";
import type { Comment } from "../types/Post";
import { CommentsModal, DeleteModal } from "./Modals";
import { useState } from "react";
import axios from "axios";

interface PostCardProps {
    date: string;
    text: string;
    user: {
        id: number;
        username: string;
        profile_picture: string;
    };
    liked: boolean;
    postId: number;
    likesCount: number;
    comments?: Comment[];
    currentUserId: number;
}

export default function PostCard({
    date,
    text,
    user,
    liked,
    postId,
    likesCount: initialLikesCount,
    comments,
    currentUserId,
}: PostCardProps) {
    const { isLiked, toggleLike, isLiking, likesCount } = useToggleLike(
        postId,
        liked,
        initialLikesCount
    );

    const [commentsIsOpen, setCommentsIsOpen] = useState(false);
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/posts/post/${postId}`, {
                withCredentials: true,
            });
            setDeleteIsOpen(false);
            window.location.reload();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <CommentsModal
                isOpen={commentsIsOpen}
                onClose={() => setCommentsIsOpen(false)}
                comments={comments}
                postId={postId}
                currentUserId={currentUserId}
            />
            <DeleteModal
                isOpen={deleteIsOpen}
                onClose={() => setDeleteIsOpen(false)}
                onDelete={handleDelete}
            />

            <div className="p-4 border border-white/5 bg-secondary rounded-lg flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Link
                            to={`/u/${user.id}`}
                            className="text-neutral-300 text-sm flex items-center gap-2"
                        >
                            <img
                                src={user.profile_picture}
                                width={20}
                                height={20}
                                className="rounded-full object-cover"
                                style={{
                                    width: 20,
                                    height: 20,
                                    minWidth: 20,
                                    minHeight: 20,
                                    maxWidth: 20,
                                    maxHeight: 20,
                                }}
                                alt="Profil bild"
                            />
                            {user.username}
                        </Link>
                        <span className="text-xs text-neutral-500">
                            {new Date(date).toLocaleDateString()}
                        </span>
                    </div>
                    {currentUserId === user.id && (
                        <button
                            className="cursor-pointer ml-auto"
                            onClick={() => setDeleteIsOpen(true)}
                        >
                            <BsThreeDots />
                        </button>
                    )}
                </div>

                <p className="mb-2">{text}</p>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 cursor-pointer" onClick={toggleLike}>
                        <FaHeart
                            color={isLiked ? "#ff3040" : "#848484"}
                            size={20}
                            className={`hover:scale-110 transition-all duration-100 ${
                                isLiking ? "opacity-50 pointer-events-none" : ""
                            }`}
                        />
                        <span className="text-sm text-neutral-300">{likesCount}</span>
                    </div>

                    <div
                        className="flex items-center gap-1 cursor-pointer"
                        onClick={() => setCommentsIsOpen(true)}
                    >
                        <FaComment
                            color="#848484"
                            size={20}
                            className="cursor-pointer hover:scale-110 transition-all duration-100"
                        />
                        <span className="text-sm text-neutral-300">{comments?.length}</span>
                    </div>
                </div>
            </div>
        </>
    );
}
