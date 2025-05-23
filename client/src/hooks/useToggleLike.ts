import { useState } from "react";
import axios from "axios";

export default function useToggleLike(
    postId: number,
    initialLiked: boolean,
    initialLikesCount: number
) {
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [likesCount, setLikesCount] = useState(initialLikesCount);
    const [isLiking, setIsLiking] = useState(false);

    const toggleLike = async () => {
        if (isLiking) return;

        setIsLiking(true);
        try {
            if (isLiked) {
                await axios.delete(`/api/like/${postId}`, {
                    withCredentials: true,
                });
                setIsLiked(false);
                setLikesCount((prev) => prev - 1);
            } else {
                await axios.post(
                    `/api/like/${postId}`,
                    {},
                    {
                        withCredentials: true,
                    }
                );
                setIsLiked(true);
                setLikesCount((prev) => prev + 1);
            }
        } catch (err) {
            console.error("Error toggling like:", err);
        } finally {
            setIsLiking(false);
        }
    };

    return { isLiked, toggleLike, isLiking, likesCount };
}
