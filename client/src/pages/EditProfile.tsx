import { useState, useEffect } from "react";
import axios from "axios";
import type { User } from "../types/User";
import useFetch from "../hooks/useFetch";
import Loader from "../components/Loader";
import Error from "../components/Error";

export default function EditProfile() {
    const [username, setUsername] = useState("");
    const [picture, setPicture] = useState<File | null>(null);
    const [msg, setMsg] = useState("");

    const { data: user, loading, error } = useFetch<User>("/api/users/me");

    useEffect(() => {
        if (user) {
            setUsername(user.username);
        }
    }, [user]);

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append("username", username);

            if (picture) {
                formData.append("picture", picture);
            }

            await axios.patch("/api/users/update-user", formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setMsg("Sparat!");
        } catch (err) {
            console.error(err);
            setMsg("Något gick fel");
        }
    };

    if (loading) return <Loader />;
    if (error) return <Error />;

    return (
        <div className="content">
            <h1 className="text-2xl mb-6">Redigera profil</h1>
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-2">
                    <label htmlFor="username">Användarnamn</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        className="bg-secondary w-md max-w-full p-2 border border-white/10 rounded-lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="flex flex-col items-start gap-2">
                    <div className="flex flex-col items-center gap-2">
                        <img
                            src={
                                picture
                                    ? URL.createObjectURL(picture)
                                    : user?.profile_picture ?? "/profileplaceholder.jpg"
                            }
                            alt="Profil bild"
                            width={150}
                            height={150}
                            className="rounded-full object-cover"
                            style={{
                                width: 150,
                                height: 150,
                                minWidth: 150,
                                minHeight: 150,
                                maxWidth: 150,
                                maxHeight: 150,
                            }}
                        />
                        <label htmlFor="picture" className="text-blue-500 cursor-pointer">
                            Välj profilbild
                            <input
                                type="file"
                                accept="image/*"
                                name="picture"
                                id="picture"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setPicture(e.target.files[0]);
                                    } else {
                                        setPicture(null);
                                    }
                                }}
                            />
                        </label>
                    </div>
                </div>

                {msg && <span>{msg}</span>}

                <button className="button" onClick={handleSave}>
                    Spara
                </button>
            </div>
        </div>
    );
}
