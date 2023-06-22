const hostUrl = process.env.NEXTAUTH_URL;

export async function loginUser(credentials: Record<"username" | "password", string> | undefined) {
    const res = await fetch(`${hostUrl}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
        }),
    });

    const user = await res.json();
    return user;
}