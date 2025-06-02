import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { Comment } from "../types/Post";
import { IoMdClose } from "react-icons/io";
import useFetch from "../hooks/useFetch";
import Loader from "./Loader";
import Error from "./Error";
import { BsThreeDots } from "react-icons/bs";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CommentModalProps extends ModalProps {
    comments: Comment[] | undefined;
    postId: number;
    currentUserId: number;
}

interface FollowlistModalProps extends ModalProps {
    fetchUrl: string;
    label: string;
}

interface NewpostModalProps extends ModalProps {
    username: string | undefined;
}

interface DeleteModalProps extends ModalProps {
    onDelete: () => void;
}

export function CommentsModal({
    isOpen,
    onClose,
    comments,
    postId,
    currentUserId,
}: CommentModalProps) {
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
        <div className="modal-overlay">
            <div className="modal">
                <div className="flex justify-center items-center relative pb-2">
                    <div onClick={onClose} className="cursor-pointer w-fit absolute left-0">
                        <IoMdClose size={20} />
                    </div>
                    <span className="mx-auto">Kommentarer</span>
                </div>
                {commentsState?.length === 0 ? (
                    <p className="text-neutral-500">Inga kommentarer</p>
                ) : (
                    <div className="flex flex-col divide-y divide-white/10 overflow-y-auto">
                        {[...commentsState]
                            .sort(
                                (a, b) =>
                                    new Date(b.created).getTime() - new Date(a.created).getTime()
                            )
                            .map((comment, index) => (
                                <div key={index} className="py-3 flex flex-col gap-2 pr-2">
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

                                        {currentUserId === comment.user_id && (
                                            <button className="cursor-pointer ml-auto">
                                                <BsThreeDots />
                                            </button>
                                        )}
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
                            className="w-full p-2 border border-white/10 rounded-lg"
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

export function FollowlistModal({ isOpen, onClose, fetchUrl, label }: FollowlistModalProps) {
    const { data, loading, error } = useFetch(fetchUrl);

    if (!isOpen) return null;
    if (loading) return <Loader />;
    if (error) return <Error />;

    if (!Array.isArray(data)) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="flex justify-center items-center relative pb-2">
                    <div onClick={onClose} className="cursor-pointer w-fit absolute left-0">
                        <IoMdClose size={20} />
                    </div>
                    <span className="mx-auto">{label}</span>
                </div>
                <div className="flex flex-col divide-y divide-white/10">
                    {data.map((user, index) => (
                        <div key={index} className="py-2">
                            <Link
                                to={`/u/${user.user_id}`}
                                className="text-neutral-300 flex items-center gap-2"
                            >
                                <img
                                    src="/profileplaceholder.jpg"
                                    width={20}
                                    className="rounded-full"
                                    alt=""
                                />
                                {user.username}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function NewpostModal({ isOpen, onClose, username }: NewpostModalProps) {
    const [text, setText] = useState("");
    const [msg, setMsg] = useState<string | null>(null);
    const [msgStyle, setMsgStyle] = useState("");
    const [loading, setLoading] = useState(false);

    const handlePost = async () => {
        if (!text) {
            setMsgStyle("text-error");
            setMsg("Ditt inlägg får inte vara tomt.");
            return;
        }

        setLoading(true);
        setMsg(null);

        try {
            const res = await axios.post(
                "/api/posts/new-post",
                { text },
                {
                    withCredentials: true,
                }
            );

            if (res.status === 201) {
                setText("");
                onClose();
                window.location.reload();
            }
        } catch (err) {
            console.error(err);
            setMsgStyle("text-error");
            setMsg("Något gick fel");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="flex justify-center items-center relative pb-6">
                    <div onClick={onClose} className="cursor-pointer w-fit absolute left-0">
                        <IoMdClose size={20} />
                    </div>
                    <span className="mx-auto">Nytt inlägg</span>
                </div>

                <div className="flex items-start gap-3">
                    <img
                        src="/profileplaceholder.jpg"
                        width={32}
                        className="rounded-full mt-1"
                        alt=""
                    />

                    <div className="w-full">
                        <span>{username}</span>
                        <textarea
                            rows={3}
                            className="w-full placeholder:text-neutral-600 focus:outline-none resize-none"
                            value={text}
                            onChange={(e) => {
                                setText(e.target.value);
                                const textarea = e.target as HTMLTextAreaElement;
                                textarea.style.height = "auto";
                                textarea.style.height = textarea.scrollHeight + "px";
                            }}
                            placeholder="Skriv ett inlägg"
                            maxLength={500}
                            style={{ overflow: "hidden" }}
                        />
                    </div>
                </div>
                <button className="button" onClick={handlePost}>
                    {loading ? "Publicerar..." : "Publicera"}
                </button>
                {msg && <p className={`mb-4 ${msgStyle}`}>{msg}</p>}
            </div>
        </div>
    );
}

export function DeleteModal({ isOpen, onClose, onDelete }: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="bg-secondary w-sm max-w-full rounded-lg">
                <ul className="text-center divide-y divide-white/10">
                    <li className="py-3 text-red-500 cursor-pointer" onClick={onDelete}>
                        Radera
                    </li>
                    <li className="py-3 cursor-pointer" onClick={onClose}>
                        Avbryt
                    </li>
                </ul>
            </div>
        </div>
    );
}
