import "./App.css"
import ChatSection from "./components/ChatSection"
import VideoSection from "./components/VideoSection"
import useSocket from "./hooks/useSocket"
import useChat from "./hooks/useChat"
import useCamera from "./hooks/useCamera"
import useWebRTC from "./hooks/useWebRTC"

function App() {
  // Custom hooks use karo - sab logic hooks me hai
  const { socketID, socket } = useSocket()
  
  const { 
    targetId, 
    setTargetId, 
    message, 
    setMessage, 
    allMessage, 
    sendMessage 
  } = useChat(socket)
  
  const { 
    localVideoStream, 
    localVideoRef, 
    getCamera 
  } = useCamera()
  
  const { 
    remoteVideoRef, 
    sendOffer 
  } = useWebRTC(socket, localVideoStream, getCamera)
  
  // Offer send karne ka wrapper function
  const handleSendOffer = () => {
    if (targetId) {
      sendOffer(targetId)
    } else {
      alert("Please enter target ID first")
    }
  }
  
  return (
    <div className="outer">
      <ChatSection
        socketID={socketID}
        allMessage={allMessage}
        targetId={targetId}
        setTargetId={setTargetId}
        message={message}
        setMessage={setMessage}
        sendMessage={sendMessage}
        sendOffer={handleSendOffer}
      />
      <VideoSection 
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
      />
    </div>
  )
}

export default App