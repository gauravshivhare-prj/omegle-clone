const chatEventHandler=(socket,io)=>{


     socket.on("sender",(senderData)=>{
        const{targetId,message}=senderData
        console.log(targetId ,message)
        io.to(targetId).emit("receiver",{
            sender:socket.id,
            message:message
        })

  })
}
module.exports={chatEventHandler}