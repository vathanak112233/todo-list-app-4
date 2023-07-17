import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import { ResponseDTO, StatusCode } from '@/utitls/responde-DTO';
import getCurrentUser from '@/utitls/auth';
const prisma = new PrismaClient()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const body = await req.body

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
            const total = await prisma.task.count();
            const responseDTO = new ResponseDTO(task, StatusCode.OK, total)
            res.send(responseDTO);
        } catch (error) {
            const responseDTO = new ResponseDTO(error, StatusCode.SERVER_ERROR, 0)
            res.send(responseDTO);
        }
    }

    if (req.method === 'POST') {
        try {
            const currentUser = await getCurrentUser(req, res);
            const task = await prisma.task.create({
                data: { ...body, userId: currentUser.id }
            });
            const responseDTO = new ResponseDTO(task, StatusCode.OK)
            res.send(responseDTO);
        } catch (error) {
            const responseDTO = new ResponseDTO([], StatusCode.SERVER_ERROR, 0)
            res.send(responseDTO);
        }
    }
}

export default handler;