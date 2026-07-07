const { getMessages, sendMessage } = require("../services/chatService");

function registerChatSocket(io, socket, onlineUsers) {
    // Note: Only implement the events required by the task.

    socket.on("typing", ({ receiver_id }) => {
        if (!receiver_id) return;
        const receiverSocketId = onlineUsers.get(Number(receiver_id));
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { sender_id: socket.userId });
        }
    });

    socket.on("stopTyping", ({ receiver_id }) => {
        if (!receiver_id) return;
        const receiverSocketId = onlineUsers.get(Number(receiver_id));
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { sender_id: socket.userId });
        }
    });

    socket.on("sendMessage", async ({ receiver_id, message }) => {
        try {
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

