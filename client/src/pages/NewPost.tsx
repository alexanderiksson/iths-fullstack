import { useState } from "react";
import axios from "axios";

export default function NewPost() {
    const [text, setText] = useState("");
    const [msg, setMsg] = useState<string | null>(null);

    const handlePost = async () => {
        setMsg(null);

        try {
            const res = await axios.post(
                "http://localhost:3000/new-post",
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
            <h1 className="text-3xl font-bold mb-4">Nytt inlägg</h1>
            <textarea
                rows={8}
                className="border border-black/20 rounded-lg w-xl max-w-full p-2"
                value={text}
                onChange={(e) => setText(e.target.value)}
            ></textarea>
            {msg && <p>{msg}</p>}
            <button
                className="flex bg-primary py-3 px-6 rounded-lg text-white cursor-pointer"
                onClick={handlePost}
            >
                Publicera
            </button>
        </div>
    );
}
