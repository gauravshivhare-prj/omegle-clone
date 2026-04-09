import React from 'react'

const RemoteVideo = ({remoteVideoRef}) => {
    return (
        <div className="remoteVideoContainer">
            <video ref={remoteVideoRef} autoPlay playsInline />
        </div>
    )
}

export default RemoteVideo