import { Link } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { DeleteModal } from "./Modals";
import { useState } from "react";
import axios from "axios";

interface CommentCardProps {
    userId: number;
    username: string;
    currentUserId: number;
    commentId: number;
    comment: string;
    date: string;
}

export default function CommentCard({
    userId,
    username,
    currentUserId,
    commentId,
    comment,
    date,
}: CommentCardProps) {
    const [deleteIsOpen, setDeleteIsOpen] = useState(false);

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/posts/comment/${commentId}`, {
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
            <DeleteModal
                isOpen={deleteIsOpen}
                onClose={() => setDeleteIsOpen(false)}
                onDelete={handleDelete}
            />
            <div className="py-3 flex flex-col gap-2 pr-2">
                <div className="flex gap-2 items-start">
                    <Link
                        to={`/u/${userId}`}
                        className="text-neutral-300 flex items-center gap-2 shrink-0"
                    >
                        <img
                            src="/profileplaceholder.jpg"
                            width={20}
                            className="rounded-full"
                            alt=""
                        />
                        {username}
                    </Link>

                    <span className="break-all">{comment}</span>

                    {currentUserId === userId && (
                        <button
                            className="cursor-pointer ml-auto"
                            onClick={() => setDeleteIsOpen(true)}
                        >
                            <BsThreeDots />
                        </button>
                    )}
                </div>
                <span className="text-xs text-neutral-500">
                    {new Date(date).toLocaleDateString()}
                </span>
            </div>
        </>
    );
}
