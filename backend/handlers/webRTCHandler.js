const webRTCHandler=(socket,io)=>{
     // Offer ko ek client se dusre client tak forward karna
  // Client A offer bhejta hai, hum use Client B tak forward karte hain
  socket.on("offer",(data)=>{
    console.log("Offer received from:",socket.id,"forwarding to:",data.targetId)
    // Target client ko offer forward karo with sender info
    io.to(data.targetId).emit("offer",{
        offer:data.offer,
        sender:socket.id  // Kis ne bheja ye batane ke liye
    })
  })

  // Answer ko ek client se dusre client tak forward karna
  // Client B answer bhejta hai, hum use Client A tak forward karte hain
  socket.on("answer",(data)=>{
    console.log("Answer received from:",socket.id,"forwarding to:",data.targetId)
    // Target client ko answer forward karo with sender info
    io.to(data.targetId).emit("answer",{
        answer:data.answer,
        sender:socket.id  // Kis ne bheja ye batane ke liye
    })
  })

  // ICE candidate ko ek client se dusre client tak forward karna
  // Jab ek client apna ICE candidate bhejta hai, hum use target client tak forward karte hain
  socket.on("ice-candidate",(data)=>{
    console.log("ICE candidate received from:",socket.id,"forwarding to:",data.targetId)
    // Target client ko ICE candidate forward karo with sender info
    io.to(data.targetId).emit("ice-candidate",{
        candidate:data.candidate,
        sender:socket.id  // Kis ne bheja ye batane ke liye
    })
  })
}

module.exports={webRTCHandler}