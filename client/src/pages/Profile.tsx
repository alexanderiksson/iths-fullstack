import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { FaHeart, FaComment } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import type { User } from "../types/User";
import type { Post } from "../types/Post";

export default function Profile() {
    const navigate = useNavigate();

    const {
        user,
        loading: authLoading,
        error: authError,
    } = useAuth() as {
        user: User | null;
        loading: boolean;
        error: unknown;
    };

    const {
        data: posts,
        loading: postsLoading,
        error: postsError,
    } = useFetch<Post[]>(user ? `http://localhost:3000/posts/${user.id}` : null);

    const {
        data: followers,
        loading: followersLoading,
        error: followersError,
    } = useFetch<User[]>(user ? `http://localhost:3000/followers/${user.id}` : null);

    const {
        data: follows,
        loading: followsLoading,
        error: followsError,
    } = useFetch<User[]>(user ? `http://localhost:3000/follows/${user.id}` : null);

    if (!user && !authLoading) {
        navigate("/login");
        return null;
    }

    if (authLoading || postsLoading || followersLoading || followsLoading) return <p>Laddar...</p>;
    if (authError || postsError || followersError || followsError) {
        console.error(authError, postsError, followersError, followsError);
        return <p>Något gick fel</p>;
    }

    return (
        <div className="content">
            <section className="flex flex-col gap-4 mb-8">
                <div className="flex">
                    <h1 className="text-3xl">{user?.username}</h1>
                </div>
                <div className="flex gap-4">
                    <span>
                        {followers?.length} <span className="text-neutral-500">följare</span>
                    </span>
                    <span>
                        {follows?.length} <span className="text-neutral-500">följer</span>
                    </span>
                </div>
            </section>

            <section>
                <h2 className="text-xl mb-4">Inlägg</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(posts) && posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div
                                key={index}
                                className="p-4 border border-black/20 rounded-lg max-w-lg flex flex-col gap-4"
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-neutral-500">
                                        {new Date(post.created).toLocaleDateString()}
                                    </span>
                                    <button className="cursor-pointer">
                                        <BsThreeDots />
                                    </button>
                                </div>

                                <p>{post.text}</p>

                                <div className="flex gap-4">
                                    <button className="cursor-pointer">
                                        <FaHeart color="gray" size={20} />
                                    </button>
                                    <button className="cursor-pointer">
                                        <FaComment color="gray" size={20} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Inga inlägg</p>
                    )}
                </div>
            </section>
        </div>
    );
}
