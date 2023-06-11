const storage = require('node-persist');
let placedPixels = [];

// store the pixels so if server stops or crashes, they still get saved
storage.init().then(() => {
    storage.getItem('placedPixels').then(r => {
        placedPixels = r || [];
        console.log(`Restored ${placedPixels.length} pixels from cache`)
    });
});


// create the http and socket server
const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: { origins: ["*"], methods: ["GET", "POST"] }
})


io.on("connection", (socket) => {
    const address = socket.request.connection.remoteAddress;
    console.log(`New connection from address ${address}\nServing ${placedPixels.length} pixels.`);
    socket.emit("welcome", placedPixels)
    socket.on("draw", (data) => {
        placedPixels.push(data);
        socket.broadcast.emit("draw", data)
        storage.setItem('placedPixels', placedPixels)
    });
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${address}`)
    });
})

httpServer.listen(process.env.PORT || 3000)
console.log('Server started')