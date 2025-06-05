export interface Comment {
    id: number;
    user_id: number;
    username: string;
    profile_picture: string;
    comment: string;
    created: string;
}

export interface Post {
    id: number;
    text: string;
    user_id: number;
    created: string;
    username: string;
    profile_picture: string;
    likes: number[];
    comments: Comment[];
}
