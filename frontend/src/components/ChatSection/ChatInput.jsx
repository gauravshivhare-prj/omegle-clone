import React from 'react'

function ChatInput({targetId,setTargetId,message,setMessage,sendMessage,sendOffer}) {
    return (
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
    )
}

export default ChatInput