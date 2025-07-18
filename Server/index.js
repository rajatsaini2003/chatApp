const express = require('express');
const WebSocket = require('ws');
const app = express();
const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const wss = new WebSocket.Server({port:8090});
wss.on('connection',(ws)=>{
    ws.on('message',(message)=>{
        console.log(`Received message: %s `,message);
    });
    ws.send('Hello from WebSocket server!');
})
