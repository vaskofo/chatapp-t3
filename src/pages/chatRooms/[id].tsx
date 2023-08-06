import { useEffect, useState } from 'react';
const { v4: uuidv4 } = require('uuid');
const id = uuidv4();
const IndexPage = () => {
    //Connect to 'ws://localhost:3001' and on button press, make server send random number to all clients
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [message, setMessage] = useState<string>('');
    const [messages, setMessages] = useState<string[]>([]);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        if (socket) {
            socket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setMessages((messages) => [...messages, data]);
            };
        }
    }, [socket]);

    const connect = () => {
        //Get current host
        let host = window.location.host.split(':')[0];
        const newSocket = new WebSocket(`ws://${host}:3001`);
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
            socket.send(JSON.stringify({ id: id, message: message }));
            setMessage('');
        }
    }

    //after render connect to websocket
    useEffect(() => {
        connect();
    }, []);

    return (
        <div className="flex flex-col justify-center items-center">
            <div>
                <h1>Websocket Test</h1>
                {/*<button className={'btn'} onClick={connect}>Connect</button>*/}
                {/*<br/>*/}
                {/*<button onClick={disconnect}>Disconnect</button>*/}
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
                             className={'bg-gray-200 rounded-lg p-2 mt-2'}
                        >
                            <span>{data.id}</span><br/>
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
