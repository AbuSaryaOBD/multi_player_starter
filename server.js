const PORT = 3000 || process.env.PORT;

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const socket = require('socket.io');
const io = socket(server);

/////////////////////////////////////////

app.use(express.static("public"));
server.listen(PORT, () => console.log(`Server Running on port ${PORT}`));

var users = [];

/////////////////////////////////////////

io.on('connection', (socket) => {
    socket.on("join", (data) => {
        console.log(data);
        users.push(data);
        io.sockets.emit("join", data);
    });

    socket.on("joined", () => {
        socket.emit("joined", users);
    });

    socket.on("rollDice", (data) => {
        users[data.id].pos = data.pos;
        const turn = data.num != 6 ? (data.id + 1) % users.length : data.id;
        io.sockets.emit("rollDice", data, turn);
    });

    socket.on("restart", () => {
        users = [];
        io.sockets.emit("restart");
    });
});
