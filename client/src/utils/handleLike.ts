import axios from "axios";

export default async function handleLike(userId: number, postId: number) {
    try {
        await axios.post(
            `/api/like/${postId}`,
            {},
            {
                withCredentials: true,
            }
        );
    } catch (err) {
        console.error(err);
    }
}
