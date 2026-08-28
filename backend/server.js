import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import visitorRoutes from "./routes/visitorRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/visitors", visitorRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL || "*" },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  // Clients join a room keyed by their userId so we can target notifications
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Make io accessible in controllers via req.app.get("io") if needed later
app.set("io", io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
