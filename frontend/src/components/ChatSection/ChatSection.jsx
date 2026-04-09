import React from 'react'
import ChatInput from './ChatInput'
import ChatArea from './ChatArea'
import ChatHeader from './ChatHeader'

const ChatSection = ({socketID,allMessage,targetId,setTargetId,message,setMessage,sendMessage,sendOffer}) => {
  return (
        <div className="chatSection">

          <ChatHeader socketID={socketID} />

          <ChatArea allMessage={allMessage} />

          <ChatInput
            targetId={targetId}
            setTargetId={setTargetId}
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            sendOffer={sendOffer}
          />


        </div>
  )
}

export default ChatSection