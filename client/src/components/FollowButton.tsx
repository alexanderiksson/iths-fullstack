import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";

interface FollowButtonProps {
    targetUserId: number | undefined;
    initialIsFollowing: boolean | undefined;
}

export default function FollowButton({ targetUserId, initialIsFollowing }: FollowButtonProps) {
    const { user } = useUser();
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setIsFollowing(initialIsFollowing);
    }, [initialIsFollowing]);

    if (!user || user.id === targetUserId) return null;

    const toggleFollow = async () => {
        setLoading(true);
        try {
            if (isFollowing) {
                await axios.delete(import.meta.env.VITE_SERVER_URL + `/follow/${targetUserId}`, {
                    withCredentials: true,
                });
                setIsFollowing(false);
            } else {
                await axios.post(
                    import.meta.env.VITE_SERVER_URL + `/follow/${targetUserId}`,
                    null,
                    {
                        withCredentials: true,
                    }
                );
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
