export interface Comment {
    user_id: number;
    comment: string;
    created: string;
}

export interface Post {
    id: number;
    text: string;
    user_id: number;
    created: string;
    username: string;
    likes: number[];
    comments: Comment[];
}
