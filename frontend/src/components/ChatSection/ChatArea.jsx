import React from 'react'

function ChatArea({allMessage}) {
  return (
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
  )
}

export default ChatArea