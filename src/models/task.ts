export interface Task {
    id?: number;
    title: string;
    description: string;
    dueDate: any;
    priority: string;
    status: string;
    updatedAt?: string;
    userId?: number;
    user?: {
        id: number;
        username: string;
    }
}