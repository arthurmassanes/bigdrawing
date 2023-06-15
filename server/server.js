const storage = require('node-persist');
const httpServer = require("http").createServer();

const restorePixels = async () => {
    await storage.init();
    const storedPixels = await storage.getItem('placedPixels');
    const placedPixels = storedPixels || [];

    console.log(`Restored ${placedPixels.length} pixels from cache`);
    return placedPixels;
}

// Main
(async () => {
    let placedPixels = await restorePixels();

    const io = require("socket.io")(httpServer, {
        serveClient: false,
        cors: { origins: ["*"], methods: ["GET", "POST"] }
    });

    io.on("connection", (socket) => {
        const address = socket.request.connection.remoteAddress;
        console.log(`New connection from address ${address}\nServing ${placedPixels.length} pixels.`);
        socket.emit("welcome", placedPixels);
        socket.on("draw", (data) => {
            placedPixels.push(data);
            socket.broadcast.emit("draw", data)
            storage.setItem('placedPixels', placedPixels)
        });
        socket.on("disconnect", () => console.log(`Client disconnected: ${address}`));
    })

    const port = process.env.PORT || 3000;
    httpServer.listen(port);
    console.log(`Server started on port ${port}`)
})();