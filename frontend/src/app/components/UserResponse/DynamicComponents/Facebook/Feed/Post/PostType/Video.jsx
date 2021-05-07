import { useEffect, useRef } from "react";
import "./Video.css";

const Video = ({ attachedMedia }) => {
  const videoRef = useRef(null);

  useEffect(() =>{
    window.global = window;
    window.Buffer = window.Buffer || require('buffer').Buffer;
    if (attachedMedia) {
      let bufferd = window.Buffer.from(attachedMedia.media.data);
      let arraybuffer = Uint8Array.from(bufferd).buffer;

      const image = new Blob([arraybuffer], {
        type: attachedMedia.mimeType
      });
      const url = URL.createObjectURL(image);
      videoRef.current.src = url;

      let options = {
        rootMargin: "0px",
        threshold: 0.25
      };
      let handlePlay = (entries, observer) => {
        if (!entries[0].isIntersecting && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      };
      let observer = new IntersectionObserver(handlePlay, options);
      observer.observe(videoRef.current);      
    }
  });
  
  return (
    <>
    {attachedMedia && <div className="postImage">
      <video ref={videoRef} controls alt="" key={attachedMedia._id}/>
    </div>}
    </>
  );
}

export default Video;
