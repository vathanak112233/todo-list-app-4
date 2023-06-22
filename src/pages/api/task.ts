import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { verifyJwt } from '@/lib/jwt';
const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const body = await req.body;
    const accessToken = req.headers.authorization;
    if (!accessToken || !verifyJwt(accessToken)) {
        return new Response(JSON.stringify({ error: accessToken }))
    }

    if (req.method === 'GET') {
        try {
            const task = await prisma.task.findMany({
                include: {
                    user: {
                        select: {
                            id: true,
                            username: true
                        }
                    }
                }
            });
            return res.json(task);
        } catch (error) {
            return res.json(error)
        }
    }

    if (req.method === 'POST') {
        try {
            const task = await prisma.task.create({
                data: body,
            });
            return res.json(task);
        } catch (error) {
            return res.json(error);
        }
    }
}