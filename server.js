const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: { origins: ["*"], methods: ["GET", "POST"] }
})

const placedPixels = [];

io.on("connection", (socket) => {
    const address = socket.request.connection.remoteAddress;
    console.log(`New connection from address ${address}`);
    socket.emit("welcome", placedPixels)
    socket.on("draw", (data) => {
        placedPixels.push(data);
        socket.broadcast.emit("draw", data)
    })
})

httpServer.listen(process.env.PORT || 3000)