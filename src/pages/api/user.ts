import { NextApiRequest, NextApiResponse } from "next";
import * as bcrypt from "bcrypt";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

interface RequestBody {
    username: string;
    password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body: RequestBody = await req.body;
    try {
        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: await bcrypt.hash(body.password, 10)
            }
        })
        return res.json(user);
    } catch (error) {
        return res.json(error);
    }

}