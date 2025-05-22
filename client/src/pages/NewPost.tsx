import { useState } from "react";
import axios from "axios";
import useAuth from "../hooks/useAuth";
import Loader from "../components/Loader";

export default function NewPost() {
    const [text, setText] = useState("");
    const [msg, setMsg] = useState<string | null>(null);

    const { loading, error } = useAuth() as {
        loading: boolean;
        error: unknown;
    };

    if (loading) return <Loader />;
    if (error) return <p>Något gick fel</p>;

    const handlePost = async () => {
        setMsg(null);

        try {
            const res = await axios.post(
                "/api/new-post",
                { text },
                {
                    withCredentials: true,
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );

            if (res.status === 201) {
                setMsg("Inlägg publicerat");
            }
        } catch (err) {
            console.error(err);
            setMsg("Något gick fel");
        }
    };

    return (
        <div className="content">
            <h1 className="text-2xl mb-8">Nytt inlägg</h1>
            <textarea
                rows={8}
                className="border border-white/10 rounded-lg w-xl max-w-full p-2 mb-4 bg-neutral-800/70 placeholder:text-neutral-500"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Skriv ett inlägg"
                required
            ></textarea>

            {msg && <p className="pb-4">{msg}</p>}

            <button
                className="flex bg-primary py-2 px-6 rounded-lg text-white cursor-pointer"
                onClick={handlePost}
            >
                Publicera
            </button>
        </div>
    );
}
