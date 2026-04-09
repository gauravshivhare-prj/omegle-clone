import { useState, useEffect } from "react"
import { io } from "socket.io-client"

// Socket instance - component ke bahar banao (singleton pattern)
let socketInstance = null

const getSocketInstance = () => {
  if (!socketInstance) {
    socketInstance = io("http://localhost:9000")
  }
  return socketInstance
}

const useSocket = () => {
  const [socketID, setSocketID] = useState("")
  const socket = getSocketInstance()
  
  useEffect(() => {
    // Connect event listener
    const handleConnect = () => {
      console.log("Connected to server")
      console.log("My socket ID:", socket.id)
      setSocketID(socket.id)
    }
    
    socket.on("connect", handleConnect)
    
    // Cleanup function
    return () => {
      socket.off("connect", handleConnect)
    }
  }, [socket])
  
  return { socketID, socket }
}

export default useSocket