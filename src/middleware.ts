import { NextRequest, NextResponse } from "next/server";
import { verifyJwt } from "./lib/jwt";
export { default } from "next-auth/middleware";

export const config = {
    matcher: ["/api/:function*"]
}

export function middleware(request: NextRequest) {
    const path = new URL(request.url).pathname;
    if (path.startsWith("/api/auth/")) {
        return;
    }

    if (!isAuthenticated(request)) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'authentication failed' }),
            { status: 401, headers: { 'content-type': 'application/json' } }
        )
    }
}

function isAuthenticated(request: NextRequest) {
    const accessToken = request.headers.get("authorization");
    return accessToken && !verifyJwt(accessToken);
}

