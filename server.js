const WebSocket = require('ws');
const {v4: uuidv4} = require('uuid');
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();

const wss = new WebSocket.Server({port: 3001});

const getRandomNumber = () => {
    return Math.floor(Math.random() * 100) + 1;
};
let chatRooms = []

async function  getChatRooms() {
    return prisma.chatRoom.findMany();
}
getChatRooms().then((data) => {
    chatRooms = data?.map((chatRoom) => {
        return {
            id: chatRoom.id,
            clients: [],
        }
    })
})

wss.on('connection', (ws, test) => {
    console.log('A client connected');

    ws.on('open', () => {
        console.log('Connected to WebSocket server');
    });


    //get query params
    let roomId = test.url
    roomId = roomId.replace('/?roomId=', '')

    // console.log('thing', test.url, roomId)

    let wsChat = chatRooms.find((chatRoom) => chatRoom.id === roomId)

    if(! wsChat) {
        console.error('Chat room not found')
        return ws.close()
    }

    console.log(wsChat)

    wsChat.clients.push(ws)

    ws.on('message', (data) => {
        data = JSON.parse(data)
        console.log(`Received: ${data.message}`);
        const response = {
            id: data.id,
            message: data.message.toString()
        };

        wsChat.clients.forEach((client) => {
            client.send(JSON.stringify(response));
        });
    });

    ws.on('close', () => {
        console.log('Disconnected from WebSocket server');
        wsChat.clients = wsChat.clients.filter((client) => client !== ws)
    });
});

module.exports = wss;
