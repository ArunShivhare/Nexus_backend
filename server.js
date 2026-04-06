import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";

import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import Message from "./models/Message.js";

dotenv.config();

const app = express();

// ✅ Create HTTP server (important for socket)
const server = http.createServer(app);

// ✅ Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// ---------------- MIDDLEWARE ----------------
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json());

// ---------------- ROUTES ----------------
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/tasks", taskRoutes);

// ---------------- TEST ROUTE ----------------
app.get("/", (req, res) => {
  res.send("Server running");
});

// ---------------- SOCKET LOGIC ----------------
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // Join task room
  socket.on("joinTask", (taskId) => {
    socket.join(taskId);
    console.log(`📌 Joined room: ${taskId}`);
  });

  // Send message
  socket.on("sendMessage", ({ taskId, message }) => {
    io.to(taskId).emit("receiveMessage", {
      ...message,
      taskId, // 🔥 include this
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

socket.on("sendMessage", async ({ taskId, message }) => {
  // save in DB
  const newMsg = await Message.create({
    taskId,
    sender: message.sender,
    text: message.text,
    time: message.time,
  });

  io.to(taskId).emit("receiveMessage", newMsg);
});

// ---------------- DATABASE ----------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ---------------- SERVER START ----------------
const PORT = process.env.PORT || 5000;

// ⚠️ IMPORTANT: use server.listen instead of app.listen
server.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
