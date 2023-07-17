import { NextApiResponse } from "next";

export interface ApiResponse<T> {
    data: T[] | T;
    statusCode: number;
    message: string;
    total: number;
}

export const statusMessages: Record<number, string> = {
    200: "OK",
    201: "Created",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    500: "Internal Server Error",
};

export enum StatusCode {
    OK = 200,
    SERVER_ERROR = 500,
    NOT_FOUND = 404,
    FORBIDDEN = 403,
    UNAUTHORIZED = 401
}

export class ResponseDTO<T> {
    private readonly data: T[] | T;
    private readonly statusCode: number;
    private readonly message?: string;
    private readonly total?: number;

    constructor(data: T[] | T, statusCode: number, total?: number, message?: string) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message || statusMessages[this.statusCode] || "Unknown Status";
        this.total = total;
    }

    send(res: NextApiResponse) {
        const response = {
            data: this.data,
            statusCode: this.statusCode,
            message: this.message,
            total: this.total,
        }
        res.status(this.statusCode).json(response);
    }
}