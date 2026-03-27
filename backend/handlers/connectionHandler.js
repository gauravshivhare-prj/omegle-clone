const { chatEventHandler } = require("./chatEventHandler")
const { webRTCHandler } = require("./webRTCHandler")

const connectionHandler = (io)=>{
    io.on('connection', (socket) => {


        chatEventHandler(socket,io)
        webRTCHandler(socket,io)
      

    })

    
}
module.exports={connectionHandler}