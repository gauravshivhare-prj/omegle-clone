import { useState, useEffect } from "react"

const useChat = (socket) => {
  const [targetId, setTargetId] = useState("")
  const [message, setMessage] = useState("")
  const [allMessage, setAllMessage] = useState([])
  
  useEffect(() => {
    // Agar socket nahi hai toh return karo
    if (!socket) return
    
    // Message receive karne ka handler
    const handleReceiveMessage = (receiverData) => {
      console.log("Message received:", receiverData)
      setAllMessage((prev) => [
        ...prev,
        {
          receiverData,
          isOwn: false,
        },
      ])
    }
    
    // Socket listener add karo
    socket.on("receiver", handleReceiveMessage)
    
    // Cleanup function
    return () => {
      socket.off("receiver", handleReceiveMessage)
    }
  }, [socket])
  
  // Message send karne ka function
  const sendMessage = () => {
    console.log("Sending message...")
    
    if (message.trim() && socket) {
      // Local state me add karo (instant feedback)
      setAllMessage((prev) => [
        ...prev,
        {
          targetId: targetId,
          message: message,
          isOwn: true,
        },
      ])
      
      // Server ko send karo
      socket.emit("sender", {
        targetId: targetId,
        message: message,
      })
      
      // Input field clear karo
      setMessage("")
    }
  }
  
  return {
    targetId,
    setTargetId,
    message,
    setMessage,
    allMessage,
    sendMessage
  }
}

export default useChat