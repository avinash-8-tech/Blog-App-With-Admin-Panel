export interface PostListProps {
    posts: Array<{
        id: number;
        title: string;
        description: string;
        slug: string;
        createdAt: Date;
        author: {
            name: string;
        }
    }>
}

export interface PostCardProps {
    post: {
        id: number;
        title: string;
        description: string;
        slug: string;
        createdAt: Date;
        author: {
            name: string;
        };
        _count?: {
            likes: number;
        };
        isLiked?: boolean;
        isSaved?: boolean;
    }
}

export interface PostContentProps {
    post: {
        id: number;
        title: string;
        description: string;
        content: string;
        slug: string;
        createdAt: Date;
        updatedAt: Date;
        author: {
            name: string;
        };
        _count?: {
            likes: number;
        };
        isLiked?: boolean;
        isSaved?: boolean;
    }
    isAuthor: Boolean
}

export interface DeletePostButtonProps{
    postId: number;
}