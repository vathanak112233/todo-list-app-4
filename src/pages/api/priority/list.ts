import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const priority = await prisma.priority.findMany();
        const total = await prisma.priority.count();
        return res.status(200).json({ data: priority, total: total });
    } catch (error) {
        return res.status(500).json({ error: error })
    }

}