import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client'
import { ResponseDTO, StatusCode } from "@/utitls/responde-DTO";
const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const id: number = Number(req.query.id);
    const body = await req.body;

    if (req.method === "GET") {
        try {
            const task = await prisma.task.findUnique({
                where: {
                    id: Number(id)
                }
            })
            const responseDTO = new ResponseDTO(task, StatusCode.OK);
            res.send(responseDTO);
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