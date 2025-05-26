import { Link } from "react-router-dom";
import type { Comment } from "../types/Post";
import { IoMdClose } from "react-icons/io";

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    comments: Comment[] | undefined;
}

export function CommentsModal({ isOpen, onClose, comments }: CommentModalProps) {
    if (!isOpen) return null;

    const newComment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <div className="w-screen h-screen fixed flex justify-center items-center top-0 left-0 bg-black/80 z-20">
            <div className="max-w-lg w-[90%] min-h-40 max-h-full bg-background rounded-lg flex flex-col shadow-lg p-4 gap-4">
                <div onClick={onClose} className="cursor-pointer w-fit">
                    <IoMdClose size={20} />
                </div>
                {comments?.length === 0 ? (
                    <p>Inga kommentarer</p>
                ) : (
                    <div className="flex flex-col divide-y divide-white/10">
                        {comments?.map((comment, index) => (
                            <div key={index} className="py-3 flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <Link
                                        to={`/u/${comment.user_id}`}
                                        className="text-neutral-300 flex items-center gap-2"
                                    >
                                        <img
                                            src="/profileplaceholder.jpg"
                                            width={20}
                                            className="rounded-full"
                                            alt=""
                                        />
                                        {comment.username}
                                    </Link>
                                    <span>{comment.comment}</span>
                                </div>
                                <span className="text-xs text-neutral-500">
                                    {new Date(comment.created).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                <div>
                    <form className="flex gap-2" onSubmit={newComment}>
                        <input
                            type="text"
                            placeholder="Kommentera"
                            className="w-full p-2 bg-neutral-900 border border-white/5 rounded-lg"
                        />
                        <button>Publicera</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
