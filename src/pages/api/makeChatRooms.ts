//Create chat rooms and store them in the database sqlite
import { NextApiRequest, NextApiResponse } from "next";
import {prisma} from "~/server/db";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  switch (method) {
    case "POST":
      try {
        const { chatRooms } = req.body;
        const newChatRooms = await prisma.chatRoom.createMany({
          data: chatRooms,
        });
        res.status(200).json(newChatRooms);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
      break;
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};