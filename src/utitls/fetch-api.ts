import { getSession } from "next-auth/react"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";
export const getRequestOption = async (method: HttpMethod, body: any) => {
    const session: any = await getSession();
    const token = session?.user.accessToken;
    const headers = {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
    }
    if (method === "GET" || method === "DELETE")
        return {
            method,
            headers
        };
    return {
        method,
        headers,
        body: JSON.stringify(body)
    };
}

export async function GET(path: string, id?: number) {
    if (id) {
        return fetch(`${path}/${id}`, await getRequestOption("GET", undefined)).then(async (res) => {
            if (res.ok) return res.json();
            throw new Error(await res.text());
        })
    }

    return fetch(path, await getRequestOption("GET", undefined)).then(async (res) => {
        if (res.ok) return res.json();
        throw new Error(await res.text());
    })
}

export async function DELETE(path: string, id: number) {
    return fetch(`${path}/${id}`, await getRequestOption("DELETE", undefined)).then(async (res) => {
        if (res.ok) return res.json();
        throw new Error(await res.text());
    })
}

export async function POST(path: string, body: any) {
    return fetch(`${path}`, await getRequestOption("POST", body)).then(async (res) => {
        if (res.ok) return res.json();
        throw new Error(await res.text());
    });
}

export async function PUT(path: string, id: number, body: any) {
    return fetch(`${path}/${id}`, await getRequestOption("PUT", body)).then(async (res) => {
        if (res.ok) return res.json();
        throw new Error(await res.text());
    })
}