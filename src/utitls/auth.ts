import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

export default async function getCurrentUser(req: NextApiRequest, res: NextApiResponse) {
    const session: any = await getServerSession(req, res, authOptions);
    const user = session?.user;
    return user;
}