import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client'
import { verifyJwt } from "@/lib/jwt";
const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id: number = Number(req.query.id);
    const body = await req.body;

    const accessToken = req.headers.authorization;
    if (!accessToken || !verifyJwt(accessToken)) {
        return res.json({ error: accessToken });
    }

    if (req.method === "GET") {
        try {
            const task = await prisma.task.findUnique({
                where: {
                    id: Number(id)
                }
            })
            return res.json(task);
        } catch (error) {
            return res.json(error);
        }
    }

    if (req.method === "PUT") {
        try {
            const updatedTask = await prisma.task.update({
                where: { id: id },
                data: body,
            });

            return res.json(updatedTask);
        } catch (error) {
            return res.json(error);
        }
    }

    if (req.method === "DELETE") {
        try {
            const deletedTask = await prisma.task.delete({
                where: { id: id },
            });
            return res.json(deletedTask);
        } catch (error) {
            return res.json(error);
        }
    }
}