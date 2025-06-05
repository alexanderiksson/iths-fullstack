import type { Post } from "./Post";

export interface User {
    id: number;
    username: string;
    profile_picture: string;
    followers: number[];
    follows: number[];
    posts: Post[];
}
