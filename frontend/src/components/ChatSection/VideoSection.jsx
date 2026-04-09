import React from 'react'
import LocalVideo from './LocalVideo'
import RemoteVideo from './RemoteVideo'

const VideoSection = ({localVideoRef,remoteVideoRef}) => {
  return (
     <div className="peerConnection">
          <div className="videoSection">
            <h3>Video Connection</h3>
            <div className="videoContainer">
              {/* Video implementation will be added here */}
            <LocalVideo localVideoRef={localVideoRef}/>

            <RemoteVideo remoteVideoRef={remoteVideoRef}/>
      

            </div>
          </div>
        </div>
  )
}

export default VideoSection