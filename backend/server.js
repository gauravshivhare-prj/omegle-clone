const express = require('express')
const http = require('http')  //Node.js built-in module for HTTP server
const {Server} = require('socket.io'); //Socket.io ka server class

const app = express()
const httpServer = http.createServer(app);

const PORT = process.env.PORT || 9000

const io = new Server(httpServer, { 
    cors:{
        origin:["http://localhost:5173", "http://localhost:5174"],
        methods:["GET","POST"]
    }
});








app.listen(PORT,()=>{
    console.log(`server is running on ${PORT} `)
})