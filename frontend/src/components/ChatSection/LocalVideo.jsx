import React from 'react'

const LocalVideo = ({localVideoRef}) => {
    return (
        <div className="localVideoContainer">
            <video ref={localVideoRef} autoPlay playsInline muted />
        </div>
    )
}

export default LocalVideo