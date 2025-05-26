import { useState } from "react";
import axios from "axios";

export default function NewPost() {
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
                setMsgStyle("text-success");
                setMsg("Inlägg publicerat!");
                setText("");
            }
        } catch (err) {
            console.error(err);
            setMsgStyle("text-error");
            setMsg("Något gick fel");
        } finally {
            setLoading(false);
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
                maxLength={500}
                required
            />

            {msg && <p className={`mb-4 ${msgStyle}`}>{msg}</p>}

            <button
                className="flex bg-primary py-2 px-6 rounded-lg text-white cursor-pointer"
                onClick={handlePost}
            >
                {loading ? "Publicerar..." : "Publicera"}
            </button>
        </div>
    );
}
