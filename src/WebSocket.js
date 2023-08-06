import { useEffect, useState, useRef } from 'react';

const WebSocketClient = () => {
    const [message, setMessage] = useState('');
    const wsRef = useRef(null);

    useEffect(() => {
        if(wsRef.current) {
            return
        }
        wsRef.current = new WebSocket('ws://localhost:3001');

        wsRef.current.onopen = () => {
            console.log('Connected to WebSocket server');
        };

        wsRef.current.onmessage = (event) => {
            const receivedMessage = event.data;
            console.log(`Sent? : ${receivedMessage}`);
            setMessage(receivedMessage); // Update the state with the received message
        };

        wsRef.current.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        return () => {
            wsRef.current.close();
        };
    }, []);

    const handleButtonClick = () => {
        if (wsRef.current.readyState === WebSocket.OPEN) {
            // Send a message to the WebSocket server when the button is pressed
            const message = 'Button clicked!';
            wsRef.current.send(message);
        }
    };

    return (
        <div>
            <h1>WebSocket Example</h1>
            <button onClick={handleButtonClick}>Press Me</button>
            <p>Received message: {message}</p>
        </div>
    );
};

export default WebSocketClient;
