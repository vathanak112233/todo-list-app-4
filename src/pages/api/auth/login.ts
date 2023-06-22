import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import * as bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

interface RequestBody {
    username: string;
    password: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body: RequestBody = await req.body;

    const user = await prisma.user.findFirst({
        where: {
            username: body.username,
        },
    });

    if (user && (await bcrypt.compare(body.password, user.password))) {
        const secret_key = process.env.SECRET_KEY;
        const { password, ...userWithoutPass } = user;
        const result = {
            ...userWithoutPass,
            accessToken: jwt.sign(user, secret_key!, { expiresIn: '1h' })
        };
        return res.json(result)
    } else return res.json(null)
}