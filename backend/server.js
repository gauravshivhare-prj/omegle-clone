const express =require("express")
const  http =require("http")
const config=require("./config/config")
const { Server } = require('socket.io');
const { connectionHandler } = require("./handlers/connectionHandler");
const app=express()

const httpServer=http.createServer(app)
const io = new Server(httpServer,{
    cors:{
        origin:config.CORS_ORIGIN,
        methods:config.CORS_METHODS
    }
});



connectionHandler(io)



httpServer.listen(config.PORT,()=>{
    console.log("server started ",config.PORT)
})