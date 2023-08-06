//Create chat rooms and store them in the database sqlite
import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient, Prisma} from "@prisma/client";
import {NextResponse} from "next/server";
const { v4: uuidv4 } = require('uuid');
const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const {method} = req;

    switch (method) {
        case "POST":
            try {
                const initCount = await prisma.chatRoom.count();
                for (let i = 0; i < 3; i++) {
                    await prisma.chatRoom.create({
                        data: {
                            id: uuidv4(),
                            name: `Chat Room ${i + 1 + initCount}`,
                        }
                    });
                }
            } catch (error) {
                res.status(500).json({error: error.message});
                break
            }

            res.status(200).json({message: "Chat rooms created"});
            break;
        default:
            res.status(200).json(await prisma.chatRoom.findMany());
    }
};