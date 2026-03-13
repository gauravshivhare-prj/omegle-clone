const { Socket } = require("dgram");
const express = require("express");
const http = require("http"); //Node.js built-in module for HTTP server
const { Server } = require("socket.io"); //Socket.io ka server class

const app = express();
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 9000;

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST"],
  },
});

app.get("/health", (req, res) => {
  res.send({
    status: "ok",
    code: "200",
    message: "fine",
  });
});

io.on("connection", (socket) => {
  console.log("new client connected", socket.id);

  socket.on("sender", (senderData) => {
    const { targetID, message } = senderData;
    console.log(targetID, message);

    io.to(targetID).emit("receiver", {
      sender: socket.id,
      message: message,
    });
  });
});

// socket.on("offer", (data) => {
//   console.log("Forwarding offer from", socket.id, "to", data.targetID);
//   io.to(data.targetID).emit("offer", {
//     offer: data.offer,
//     sender: socket.id,
//   });
// });

// socket.on("answer", (data) => {
//   console.log("Forwarding answer from", socket.id, "to", data.targetID);
//   io.to(data.targetID).emit("answer", {
//     answer: data.answer,
//     sender: socket.id,
//   });
// });

// socket.on("ice-candidate", (data) => {
//   console.log("Forwarding ICE candidate from", socket.id, "to", data.targetID);
//   io.to(data.targetID).emit("ice-candidate", {
//     candidate: data.candidate,
//     sender: socket.id,
//   });
// });

httpServer.listen(PORT, () => {
  console.log(`server is running on ${PORT} `);
});
