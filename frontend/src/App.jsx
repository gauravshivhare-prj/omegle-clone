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

  const localVideo = useRef(null);
  const localStream = useRef(null);
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
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id); // x8WIv7-mJelg7on_ALbx
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
            </div>
          </div>

          {/* chat section ends */}
        </div>
        <div className="peerConnection">
          <div className="videoSection">
            <h3>Video Connection</h3>
            <div className="videoContainer">
              {/* Video implementation will be added here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
