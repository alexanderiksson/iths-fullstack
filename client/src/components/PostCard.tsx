import { BsThreeDots } from "react-icons/bs";
import { FaHeart, FaComment } from "react-icons/fa6";
import { Link } from "react-router-dom";

interface PostCardProps {
    date: string;
    text: string;
    user: {
        id: number;
        username: string;
    };
}

export default function PostCard({ date, text, user }: PostCardProps) {
    return (
        <div className="p-4 border border-white/5 rounded-lg flex flex-col gap-4 bg-neutral-800/50">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {user && (
                        <Link
                            className="text-neutral-300 text-sm flex items-center gap-2"
                            to={`/u/${user.id}`}
                        >
                            <img
                                src="/profileplaceholder.jpg"
                                width={20}
                                className="rounded-full"
                                alt=""
                            />
                            {user.username}
                        </Link>
                    )}
                    <span className="text-xs text-neutral-500">
                        {new Date(date).toLocaleDateString()}
                    </span>
                </div>

                <button className="cursor-pointer ml-auto">
                    <BsThreeDots />
                </button>
            </div>

            <p className="mb-2">{text}</p>

            <div className="flex items-center gap-4">
                <FaHeart color="grey" size={20} className="cursor-pointer" />
                <FaComment color="grey" size={20} className="cursor-pointer" />
            </div>
        </div>
    );
}
