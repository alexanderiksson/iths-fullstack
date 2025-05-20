import { useNavigate } from "react-router-dom";
import { BsThreeDots } from "react-icons/bs";
import { FaHeart, FaComment } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import useFetch from "../hooks/useFetch";
import type { User } from "../types/User";
import Loader from "../components/common/Loader";

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
        data: userData,
        loading: userLoading,
        error: userError,
    } = useFetch<User>(user ? `http://localhost:3000/user/${user.id}` : null);

    if (!user && !authLoading) {
        navigate("/login");
        return null;
    }

    if (authLoading || userLoading) return <Loader />;
    if (authError || userError) {
        console.error(authError, userError);
        return <p>Något gick fel</p>;
    }

    return (
        <div className="content">
            <section className="flex flex-col gap-4 mb-8">
                <div className="flex">
                    <h1 className="text-3xl">{userData?.username}</h1>
                </div>
                <div className="flex gap-4">
                    <span>
                        {userData?.followers.length}{" "}
                        <span className="text-neutral-500">följare</span>
                    </span>
                    <span>
                        {userData?.follows.length} <span className="text-neutral-500">följer</span>
                    </span>
                    <span>
                        {userData?.posts.length} <span className="text-neutral-500">Inlägg</span>
                    </span>
                </div>
            </section>

            <section>
                <h2 className="text-xl mb-4">Inlägg</h2>
                <div className="flex flex-col gap-4">
                    {Array.isArray(userData?.posts) && userData.posts.length > 0 ? (
                        userData.posts
                            .slice()
                            .reverse()
                            .map((post, index) => (
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
