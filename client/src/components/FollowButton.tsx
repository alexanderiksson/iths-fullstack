import { useState, useEffect } from "react";
import axios from "axios";

interface FollowButtonProps {
    userId: number | undefined;
    targetUserId: number | undefined;
    initialIsFollowing: boolean | undefined;
}

export default function FollowButton({
    userId,
    targetUserId,
    initialIsFollowing,
}: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    if (!userId || userId === targetUserId) return null;

    const toggleFollow = async () => {
        setLoading(true);

        try {
            if (isFollowing) {
                await axios.delete(`/api/follow/${targetUserId}`, {
                    withCredentials: true,
                });
                setIsFollowing(false);
            } else {
                await axios.post(`/api/follow/${targetUserId}`, null, {
                    withCredentials: true,
                });
                setIsFollowing(true);
            }
        } catch (err) {
            console.error("Fel vid följning", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            disabled={loading}
            onClick={toggleFollow}
            className={`flex ${
                isFollowing ? "bg-transparent" : "bg-primary"
            } border-2 border-primary py-2 px-6 rounded-lg text-white cursor-pointer`}
        >
            {loading ? "Laddar..." : isFollowing ? "Sluta följ" : "Följ"}
        </button>
    );
}
