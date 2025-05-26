import type { Comment } from "../types/Post";

interface CommentModalProps {
    isOpen: boolean;
    onClose: () => void;
    comments: Comment[];
}

export function CommentsModal({ isOpen, onClose, comments }: CommentModalProps) {
    return (
        <div className={isOpen ? "block" : "hidden"}>
            <div onClick={onClose}>close</div>
            <div>
                {comments.map((comment, index) => (
                    <div key={index}>{comment.comment}</div>
                ))}
            </div>
        </div>
    );
}
