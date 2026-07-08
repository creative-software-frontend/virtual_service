const { getMessages, sendMessage } = require("../services/chatService");

function registerChatSocket(io, socket, onlineUsers) {
    // Note: Only implement the events required by the task.

    socket.on("typing", async ({ receiver_id }) => {
        if (!receiver_id) return;
        // Protect socket chat events by membership feature
        const { hasFeature } = require("../middleware/membershipMiddleware");
        try {
            const allowed = await hasFeature(socket.userId, "chat");
            if (!allowed) {
                socket.emit("error", { error: true, message: "Upgrade to Silver to use chat." });
                console.log("[SOCKET CHAT BLOCKED] typing");
                return;
            }
        } catch {
            socket.emit("error", { error: true, message: "Membership check failed" });
            return;
        }

        const receiverSocketId = onlineUsers.get(Number(receiver_id));
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { sender_id: socket.userId });
        }
    });


    socket.on("stopTyping", async ({ receiver_id }) => {
        if (!receiver_id) return;
        const { hasFeature } = require("../middleware/membershipMiddleware");
        try {
            const allowed = await hasFeature(socket.userId, "chat");
            if (!allowed) {
                socket.emit("error", { error: true, message: "Upgrade to Silver to use chat." });
                console.log("[SOCKET CHAT BLOCKED] stopTyping");
                return;
            }
        } catch {
            socket.emit("error", { error: true, message: "Membership check failed" });
            return;
        }

        const receiverSocketId = onlineUsers.get(Number(receiver_id));
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { sender_id: socket.userId });
        }
    });


    socket.on("sendMessage", async ({ receiver_id, message }) => {
        try {
            const { hasFeature } = require("../middleware/membershipMiddleware");
            const allowed = await hasFeature(socket.userId, "chat");
            if (!allowed) {
                socket.emit("error", { error: true, message: "Upgrade to Silver to use chat." });
                console.log("[SOCKET CHAT BLOCKED] sendMessage");
                return;
            }

            const senderId = socket.userId;
            const payload = await sendMessage({
                senderId,
                receiverId: receiver_id,
                message
            });


            // Emit only AFTER successful DB insert
            const receiverSocketId = onlineUsers.get(Number(receiver_id));
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", payload);
            }

            // Optionally confirm to sender? Task does not list an event for this, so we do not.
        } catch (err) {
            socket.emit("error", { message: err.message || "Message send failed" });
        }
    });

    socket.on("markAsRead", async () => {
        // Not implemented because schema changes are disallowed.
        // Kept to avoid inventing new REST/storage behavior.
    });

    socket.on("connection", () => {
        // no-op; connection is handled by socket.js
    });

    socket.on("disconnect", () => {
        // no-op; disconnect is handled by socket.js
    });
}

module.exports = {
    registerChatSocket
};

