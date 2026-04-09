import { useState, useRef } from "react"

const useCamera = () => {
  const [localVideoStream, setLocalVideoStream] = useState(null)
  const localVideoRef = useRef(null)
  
  // Camera access karne ka function
  const getCamera = async () => {
    // Agar stream already hai toh return karo
    if (localVideoStream) {
      console.log("Camera already active")
      return localVideoStream
    }
    
    try {
      console.log("Requesting camera access...")
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      })
      
      console.log("Camera access granted")
      
      // Video element me stream set karo
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // State update karo
      setLocalVideoStream(stream)
      
      return stream
    } catch (error) {
      console.error("Camera access denied:", error)
      alert("Video and audio access required for this app")
      throw error
    }
  }
  
  // Camera band karne ka function
  const stopCamera = () => {
    if (localVideoStream) {
      console.log("Stopping camera...")
      
      // Sab tracks stop karo (video + audio)
      localVideoStream.getTracks().forEach(track => {
        track.stop()
        console.log(`Stopped track: ${track.kind}`)
      })
      
      // State clear karo
      setLocalVideoStream(null)
      
      // Video element clear karo
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null
      }
    }
  }
  
  return { 
    localVideoStream, 
    localVideoRef, 
    getCamera, 
    stopCamera 
  }
}

export default useCamera