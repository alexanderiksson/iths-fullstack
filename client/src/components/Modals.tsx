import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import type { Comment } from "../types/Post";
import useFetch from "../hooks/useFetch";
import Loader from "./Loader";
import Error from "./Error";
import CommentCard from "./CommentCard";
import { IoMdClose } from "react-icons/io";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DeleteModalProps extends ModalProps {
    onDelete: () => void;
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
    username: string;
    profilePicture: string | undefined;
}

export function DeleteModal({ isOpen, onClose, onDelete }: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="bg-secondary w-sm max-w-[90%] rounded-lg">
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
            const res = await axios.post(
                `/api/posts/comment/${postId}`,
                { comment: comment },
                {
                    withCredentials: true,
                }
            );

            setCommentsState([
                {
                    id: res.data.id,
                    user_id: currentUser.data.id,
                    username: currentUser.data.username,
                    profile_picture: currentUser.data.profile_picture,
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
                                <CommentCard
                                    key={index}
                                    userId={comment.user_id}
                                    username={comment.username}
                                    profile_picture={
                                        comment.profile_picture ?? "/profileplaceholder.jpg"
                                    }
                                    currentUserId={currentUserId}
                                    commentId={comment.id}
                                    comment={comment.comment}
                                    date={comment.created}
                                />
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
                                    src={user.profile_picture ?? "/profileplaceholder.jpg"}
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
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export function NewpostModal({ isOpen, onClose, username, profilePicture }: NewpostModalProps) {
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
                        src={profilePicture ?? "/profileplaceholder.jpg"}
                        width={32}
                        height={32}
                        className="rounded-full object-cover mt-1"
                        style={{
                            width: 32,
                            height: 32,
                            minWidth: 32,
                            minHeight: 32,
                            maxWidth: 32,
                            maxHeight: 32,
                        }}
                        alt="Profil bild"
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
