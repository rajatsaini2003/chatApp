import { WebSocketServer,WebSocket } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
interface User{
    socket: WebSocket;
    room : string;
}
let allSocket:User[] = [];

const getRoomUserCount = (roomId: string): number => {
    return allSocket.filter(user => user.room === roomId).length;
};

const broadcastUserCount = (roomId: string) => {
    const userCount = getRoomUserCount(roomId);
    allSocket.forEach(user => {
        if (user.room === roomId) {
            user.socket.send(JSON.stringify({ 
                type: 'userCount', 
                count: userCount 
            }));
        }
    });
};

wss.on('connection', (ws) => {

    ws.on('message', (message:string) => {
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === 'join') {
            const user: User = { 
                socket: ws, 
                room: parsedMessage.payload.roomId 
            };
            allSocket.push(user);
            broadcastUserCount(parsedMessage.payload.roomId);
        } 
        if (parsedMessage.type === 'message') {
            const user = allSocket.find(u => u.socket === ws);
            if (user) {
                allSocket.forEach(u => {
                    if (u.room === user.room ) {
                        u.socket.send(JSON.stringify({ type: 'message', message: parsedMessage.payload.message }));
                    }
                });
            }
        }
    })
    ws.on('close', () => {
        const user = allSocket.find(u => u.socket === ws);
        const roomId = user?.room;
        allSocket = allSocket.filter(u => u.socket !== ws);
        if (roomId) {
            broadcastUserCount(roomId);
        }
        console.log(`User disconnected from room: ${roomId}`);
    });
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});