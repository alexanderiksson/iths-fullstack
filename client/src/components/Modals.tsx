import { Link } from "react-router-dom";
import type { Comment } from "../types/Post";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import axios from "axios";

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    comments: Comment[] | undefined;
    postId: number;
}

export function CommentsModal({ isOpen, onClose, comments, postId }: CommentModalProps) {
    const [commentsState, setCommentsState] = useState<Comment[]>([...(comments ?? [])]);
    const [comment, setComment] = useState("");

    if (!isOpen) return null;

    const handleNewComment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const currentUser = await axios.get("/api/users/me", {
            withCredentials: true,
        });

        try {
            await axios.post(
                `/api/posts/comment/${postId}`,
                { comment: comment },
                {
                    withCredentials: true,
                }
            );

            setCommentsState([
                {
                    user_id: currentUser.data.id,
                    username: currentUser.data.username,
                    comment: comment,
                    created: new Date().toString(),
                },
                ...commentsState,
            ]);

            setComment("");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="w-screen h-screen fixed flex justify-center items-center top-0 left-0 bg-black/80 z-20">
            <div className="max-w-lg w-[90%] min-h-40 max-h-screen bg-background rounded-lg flex flex-col shadow-lg p-4 gap-4">
                <div onClick={onClose} className="cursor-pointer w-fit">
                    <IoMdClose size={20} />
                </div>
                {commentsState?.length === 0 ? (
                    <p>Inga kommentarer</p>
                ) : (
                    <div className="flex flex-col divide-y divide-white/10 overflow-y-auto">
                        {[...commentsState]
                            .sort(
                                (a, b) =>
                                    new Date(b.created).getTime() - new Date(a.created).getTime()
                            )
                            .map((comment, index) => (
                                <div key={index} className="py-3 flex flex-col gap-2">
                                    <div className="flex gap-2 items-start">
                                        <Link
                                            to={`/u/${comment.user_id}`}
                                            className="text-neutral-300 flex items-center gap-2 shrink-0"
                                        >
                                            <img
                                                src="/profileplaceholder.jpg"
                                                width={20}
                                                className="rounded-full"
                                                alt=""
                                            />
                                            {comment.username}
                                        </Link>
                                        <span className="break-all">{comment.comment}</span>
                                    </div>
                                    <span className="text-xs text-neutral-500">
                                        {new Date(comment.created).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                    </div>
                )}
                <div>
                    <form className="flex gap-2" onSubmit={handleNewComment}>
                        <input
                            type="text"
                            placeholder="Kommentera"
                            className="w-full p-2 bg-neutral-900 border border-white/5 rounded-lg"
                            required
                            onChange={(e) => setComment(e.target.value)}
                            value={comment}
                            maxLength={500}
                        />
                        <button
                            type="submit"
                            className="bg-primary px-3 py-2 rounded-lg cursor-pointer"
                        >
                            Publicera
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
