import { useRef, useEffect } from "react"

const useWebRTC = (socket, localVideoStream, getCamera) => {
  const pc = useRef(null)
  const remoteRef = useRef(null)
  const remoteVideoRef = useRef(null)
  
  // Peer connection setup karne ka function
  const connectPC = () => {
    console.log("Creating peer connection...")
    
    pc.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ],
    })
    
    console.log("Peer connection created")
    
    // ICE candidate generate hone par
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate generated")
        socket.emit("ice-candidate", {
          targetId: remoteRef.current,
          candidate: event.candidate
        })
        console.log("ICE candidate sent to:", remoteRef.current)
      } else {
        console.log("All ICE candidates have been sent")
      }
    }
    
    // Remote track receive hone par
    pc.current.ontrack = (event) => {
      console.log("Remote track received")
      
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0]
        console.log("Remote video stream set")
      }
    }
    
    // Connection state changes
    pc.current.onconnectionstatechange = () => {
      console.log("Connection state:", pc.current.connectionState)
    }
  }
  
  // Offer send karne ka function
  const sendOffer = async (targetId) => {
    console.log("Sending offer to:", targetId)
    remoteRef.current = targetId
    
    // Camera stream get karo
    let stream = localVideoStream
    if (!localVideoStream) {
      console.log("Camera not active, requesting access...")
      stream = await getCamera()
    }
    
    // Peer connection setup karo
    connectPC()
    
    // Local tracks add karo peer connection me
    stream.getTracks().forEach(track => {
      pc.current.addTrack(track, stream)
      console.log(`Added ${track.kind} track to peer connection`)
    })
    
    // Offer create karo
    const offer = await pc.current.createOffer()
    console.log("Offer created")
    
    // Local description set karo
    await pc.current.setLocalDescription(offer)
    console.log("Local description set")
    
    // Server ko offer send karo
    socket.emit("offer", {
      targetId: targetId,
      offer: offer,
    })
    console.log("Offer sent to server")
  }
  
  // Socket event listeners
  useEffect(() => {
    if (!socket) return
    
    // Offer receive karne ka handler
    const handleOffer = async (data) => {
      console.log("Offer received from:", data.sender)
      remoteRef.current = data.sender
      
      // Camera stream get karo
      let stream = localVideoStream
      if (!localVideoStream) {
        console.log("Camera not active, requesting access...")
        stream = await getCamera()
      }
      
      // Peer connection setup karo
      connectPC()
      
      // Local tracks add karo
      stream.getTracks().forEach(track => {
        pc.current.addTrack(track, stream)
        console.log(`Added ${track.kind} track to peer connection`)
      })
      
      // Remote description set karo
      await pc.current.setRemoteDescription(data.offer)
      console.log("Remote description set")
      
      // Answer create karo
      const answer = await pc.current.createAnswer()
      console.log("Answer created")
      
      // Local description set karo
      await pc.current.setLocalDescription(answer)
      console.log("Local description set")
      
      // Server ko answer send karo
      socket.emit("answer", {
        answer: answer,
        targetId: data.sender,
      })
      console.log("Answer sent to:", data.sender)
    }
    
    // Answer receive karne ka handler
    const handleAnswer = async (data) => {
      console.log("Answer received from:", data.sender)
      
      // Remote description set karo
      await pc.current.setRemoteDescription(data.answer)
      console.log("Connection established!")
    }
    
    // ICE candidate receive karne ka handler
    const handleIceCandidate = async (data) => {
      console.log("ICE candidate received from:", data.sender)
      
      if (pc.current && data.candidate) {
        try {
          await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate))
          console.log("ICE candidate added successfully")
        } catch (error) {
          console.error("Error adding ICE candidate:", error)
        }
      } else {
        console.log("Peer connection not ready or candidate is null")
      }
    }
    
    // Socket listeners add karo
    socket.on("offer", handleOffer)
    socket.on("answer", handleAnswer)
    socket.on("ice-candidate", handleIceCandidate)
    
    // Cleanup function
    return () => {
      socket.off("offer", handleOffer)
      socket.off("answer", handleAnswer)
      socket.off("ice-candidate", handleIceCandidate)
    }
  }, [socket, localVideoStream, getCamera])
  
  return { 
    remoteVideoRef, 
    sendOffer 
  }
}

export default useWebRTC