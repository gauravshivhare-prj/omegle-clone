import React from 'react'

function ChatHeader({socketID}) {
  return (
        <div className="userHeader">{socketID}</div>
  )
}

export default ChatHeader