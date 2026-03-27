import { useEffect, useRef } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("http://localhost:9000");

function App() {
  const [socketID, setSocketID] = useState("");
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);
  const [localVideoStream, setLocalVideoStream] = useState(null) /// thodi der me. 


  const pc = useRef(null);
  const remoteRef = useRef(null)
  const localVideoRef = useRef(null)






  // Peer connection setup karna with ICE candidate handling
  const connectPC = () => {
    console.log("Creating peer connection...");

    pc.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" }
      ],
    });

    console.log("Peer connection created");

    // ICE candidate generate hone par
    pc.current.onicecandidate = (event) => {
      if (event.candidate) {
        console.log("New ICE candidate generated:", event.candidate.candidate);
        socket.emit("ice-candidate", {
          targetId: remoteRef.current,
          candidate: event.candidate
        });
        console.log("ICE candidate sent to:", remoteRef.current);
      } else {
        console.log("All ICE candidates have been sent");
      }
    };




  };

  const sendOffer = async () => {
    console.log("Send offer called");
    console.log("Target ID:", targetId);

    remoteRef.current = targetId;
    console.log("Remote ID stored:", remoteRef.current);
    let stream=localVideoStream
    if (!localVideoStream) {
      stream =await getCamera()
    }
    connectPC();

    stream.getTracks().forEach(track => pc.current.addTrack(track, stream));




    console.log("Creating offer...");
    const offer = await pc.current.createOffer();

    console.log("Offer created:", offer.type);

    await pc.current.setLocalDescription(offer);
    console.log("Local description set");

    socket.emit("offer", {
      targetId: targetId,
      offer: offer,
    });
    console.log("Offer sent to server for:", targetId);
  };

  const sendMessage = () => {
    console.log("ruk ja bhej raha hu");
    if (message.trim()) {
      setAllMessage((prev) => [
        ...prev,
        {
          targetId: targetId,
          message: message,
          isOwn: true,
        },
      ]);
      socket.emit("sender", {
        targetId: targetId,
        message: message,
      });
    }
  };



  const getCamera = async () => {


    try {

      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setLocalVideoStream(stream)
      localVideoRef.current.srcObject = stream

      return stream
    } catch (error) {
      console.log("camera and. video access denied ", error)
      alert("video and  auido required")
    }



  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
      console.log("My socket ID:", socket.id);
      setSocketID(socket.id);
    });

    socket.on("receiver", (receiverData) => {
      setAllMessage((prev) => [
        ...prev,
        {
          receiverData,
          isOwn: false,
        },
      ]);
    });

    socket.on("offer", async (data) => {
      console.log("Offer received from:", data.sender);
      console.log("Offer type:", data.offer.type);

      remoteRef.current = data.sender;
      console.log("Remote ID stored:", remoteRef.current);
          let stream=localVideoStream

      if (!localVideoStream) {
        stream =await getCamera()
      }

      connectPC()
    stream.getTracks().forEach(track => pc.current.addTrack(track, stream));



      console.log("Setting remote description...");
      await pc.current.setRemoteDescription(data.offer);
      console.log("Remote description set");

      console.log("Creating answer...");
      const answer = await pc.current.createAnswer();
      console.log("Answer created:", answer.type);

      await pc.current.setLocalDescription(answer);
      console.log("Local description set");

      socket.emit("answer", {
        answer: answer,
        targetId: data.sender,
      });
      console.log("Answer sent to:", data.sender);
    });




    socket.on("ice-candidate", async (data) => {
      console.log("ICE candidate received from:", data.sender);

      if (pc.current && data.candidate) {
        try {
          await pc.current.addIceCandidate(new RTCIceCandidate(data.candidate));
          console.log("ICE candidate added successfully");
        } catch (error) {
          console.error("Error adding ICE candidate:", error);
        }
      } else {
        console.log("Peer connection not ready or candidate is null");
      }
    });


    socket.on("answer", async (data) => {
      console.log("Answer received from:", data.sender);
      console.log("Answer type:", data.answer.type);

      console.log("Setting remote description...");
      await pc.current.setRemoteDescription(data.answer);
      console.log("Remote description set - Connection negotiation complete!");
    });


  }, []);

  return (
    <>
      <div className="outer">
        <div className="chatSection">
          <div className="userHeader">{socketID}</div>
          <div className="chatArea">
            {allMessage.map((msg, index) => (
              <div
                key={index}
                className={msg.isOwn ? "message own" : "message other"}
              >
                <div className="messageSender">
                  {msg.isOwn ? "You" : msg.receiverData?.sender || "User"}
                </div>
                <div className="messageContent">
                  {msg.message || msg.receiverData?.message}
                </div>
              </div>
            ))}
          </div>
          <div className="inputArea">
            <input
              type="text"
              placeholder="Enter target ID"
              value={targetId}
              onChange={(e) => setTargetId(e.target.value)}
            />
            <div className="messageInputContainer">
              <input
                type="text"
                placeholder="Enter your message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button onClick={sendMessage}>Send</button>
              <button onClick={sendOffer}>Send Offer</button>
            </div>
          </div>

          {/* chat section ends */}
        </div>
        <div className="peerConnection">
          <div className="videoSection">
            <h3>Video Connection</h3>
            <div className="videoContainer">
              {/* Video implementation will be added here */}
              <div className="localVideoContainer">
                <video ref={localVideoRef} autoPlay playsInline muted/>
              </div>


            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;