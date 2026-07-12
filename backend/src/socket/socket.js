const { Server } = require("socket.io");
const { verifySocketJwt } = require("./socketAuth");
const { registerChatSocket } = require("./chatSocket");

function setupSocket(httpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5176"
            ],
            credentials: true
        }
    });

    // userId -> socketId (online users)
    const onlineUsers = new Map();

    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(" ")[1];
            if (!token) {
                return next(new Error("Unauthorized"));
            }
            const { userId, role } = await verifySocketJwt(token);
            socket.userId = userId;
            socket.role = role;
            return next();
        } catch (err) {
            return next(err);
        }
    });

    io.on("connection", (socket) => {
        // Cleanup/replace on reconnect
        for (const [userId, sockId] of onlineUsers.entries()) {
            if (sockId === socket.id) {
                onlineUsers.delete(userId);
            }
        }
        if (socket.userId != null) {
            onlineUsers.set(socket.userId, socket.id);
        }

        registerChatSocket(io, socket, onlineUsers);

        socket.on("disconnect", () => {
            if (socket.userId != null && onlineUsers.get(socket.userId) === socket.id) {
                onlineUsers.delete(socket.userId);
            }
        });
    });

    return io;
}

module.exports = {
    setupSocket
};

