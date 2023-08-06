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
    let urlParams = getQueryParams(test.url)

    let wsChat = chatRooms.find((chatRoom) => chatRoom.id === urlParams.roomId)

    if(! wsChat) {
        console.error('Chat room not found')
        return ws.close()
    }

    //push ws and
    ws.user_id = urlParams.id
    ws.user_name = urlParams.name
    wsChat.clients.push(ws)

    getChatRoomUsers(wsChat)

    ws.on('message', (data) => {
        data = JSON.parse(data)
        // console.log(`Received: ${data.message}`);
        if(data.type === 'message'){
            const response = {
                id: data.id,
                name: findClientById(data.id, wsChat)?.user_name,
                message: data.message.toString(),
                type: 'message'
            };

            wsChat.clients.forEach((client) => {
                client.send(JSON.stringify(response));
            });
        }
    });

    ws.on('close', () => {
        console.log('Disconnected from WebSocket server');
        wsChat.clients = wsChat.clients.filter((client) => client !== ws)
        getChatRoomUsers(wsChat)
    });
});
function findClientById(id, wsChat) {
    return wsChat.clients.find((client) => client.user_id === id)
}
function getChatRoomUsers(wsChat) {
    const response = {
        type: 'chatRoomUsers',
        users: wsChat.clients.map((client) => {
            return {
                id: client.user_id,
                name: client.user_name
            }
        })
    }

    return wsChat.clients.map((client) => {
        client.send(JSON.stringify(response));
    })
}

function getQueryParams(url) {
    const queryParams = {};
    const queryString = url.split('?')[1];

    if (queryString) {
        const pairs = queryString.split('&');
        for (const pair of pairs) {
            const [key, value] = pair.split('=');
            queryParams[key] = decodeURIComponent(value || '');
        }
    }

    return queryParams;
}

module.exports = wss;
