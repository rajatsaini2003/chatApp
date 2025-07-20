import { WebSocketServer,WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
interface User{
    socket: WebSocket;
    room : string;
}
let allSocket:User[] = [];
let userCount = 0;
wss.on('connection', (ws) => {

    ws.on('message', (message:string) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'join') {
            const user: User = { 
                socket: ws, 
                room: parsedMessage.payload.roomId 
            };
            allSocket.push(user);
            userCount++;
            console.log(`User joined room ${parsedMessage.payload.roomId}.`);
        } 
        if (parsedMessage.type === 'message') {
            const user = allSocket.find(u => u.socket === ws);
            if (user) {
                console.log(`Message from room ${user.room}: ${parsedMessage.payload.message}`);
                allSocket.forEach(u => {
                    if (u.room === user.room ) {
                        u.socket.send(JSON.stringify({ type: 'message', message: parsedMessage.payload.message }));
                    }
                });
            }
        }
    })
    ws.on('close', () => {
        allSocket = allSocket.filter(u => u.socket !== ws);
        userCount--;
        console.log(`User disconnected. Total users: ${userCount}`);
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});