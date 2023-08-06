import { useEffect, useState } from 'react';
const { v4: uuidv4 } = require('uuid');
let id = null;
let name = null;
import { useRouter } from 'next/router';

const IndexPage = () => {
    const router = useRouter();
    const roomId = router.query.id?.toString() ?? '';

    //Connect to 'ws://localhost:3001' and on button press, make server send random number to all clients
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);
    const [connected, setConnected] = useState<boolean>(false);
    const [users, setUsers] = useState<string[]>([]);

    //get user id from localStorage, if doesn't exist, create one
    useEffect(() => {
        if(! id){
            if (!localStorage.getItem('id')) {
                id = uuidv4();
                localStorage.setItem('id', id);
            } else {
                id = localStorage.getItem('id');
            }
        }
    }, []);

    //listen to websocket

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data)
                if(data.type === 'message'){
                    setMessages((messages) => [data, ...messages]);
                } else if (data.type === 'chatRoomUsers'){
                    setUsers(data.users)
                }
            };
        }
    }, [socket]);

    const connect = (roomId: string) => {
        console.log(roomId, 'connect')

        name = localStorage.getItem('name');

        if(! name){
            router.push('/');
            return;
        }

        //Get current host
        const host = window.location.host.split(':')[0];
        //Connect to websocket and send the current roomId
        if(! roomId) {
            return;
        }

        let newSocket = null;
        if (window.location.protocol === 'http:') {
            newSocket = new WebSocket(`ws://localhost:3001/?roomId=${roomId?.toString()}&id=${id}&name=${name}`);
        } else {
            newSocket = new WebSocket(`wss://chatapp-t3.sofiaconstantino.com:3001/?roomId=${roomId?.toString()}&id=${id}&name=${name}`);
        }

        newSocket.onopen = () => {
            setConnected(true);
        };
        setSocket(newSocket);
    }

    const disconnect = () => {
        if (socket) {
            socket.close();
            setConnected(false);
        }
    }

    const sendMessage = () => {
        if (socket) {
            socket.send(JSON.stringify({ id: id, message: message, type: 'message' }));
            setMessage('');
        }
    }

    //after render connect to websocket
    useEffect(() => {
        if (roomId) {
            connect(roomId);
        }
    }, [roomId]);

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                <div className={'flex justify-between'}>
                    <h1>Websocket Test</h1>
                    Users: {users.length}
                </div>
                <div>
                    <input
                        className={'bg-gray-200 rounded-lg mr-2'}
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
                <div>
                    Status: {connected ? 'Connected' : 'Disconnected'}
                </div>
                <div className={'mt-5'}>
                    Message: <br/>
                    {messages.map((data, index) => (
                        <div key={index}
                             className={'border-2 border-black rounded-lg p-2 mt-2'}
                        >
                            <span>{data.name}</span><br/>
                            {data.message}
                        </div>
                    ))}
                    {/*{messages.map((message, index) => (*/}
                    {/*    <div key={index}>{message}</div>*/}
                    {/*))}*/}
                </div>
            </div>
        </div>
    );
};

export default IndexPage;
