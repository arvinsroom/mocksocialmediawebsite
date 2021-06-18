import { useEffect, useRef, useState } from "react";
import "./DynamicMedia.css";

const DynamicMedia = ({ attachedMedia }) => {
  // we only handle cases for image and videos
  const [mediaType, setMediaType] = useState(null);
  const [isPhoto, setIsPhoto] = useState(null);
  const imageRef = useRef(null);
  const videoRef = useRef(null);

  const updateState = async () => {
    await setMediaType(attachedMedia.mimeType);
    await setIsPhoto(attachedMedia.mimeType.indexOf('image') === -1 ? false : true);
  }  

  useEffect(() => {
    if (attachedMedia) {
      updateState();
      window.global = window;
      window.Buffer = window.Buffer || require('buffer').Buffer;  
      let bufferd = window.Buffer.from(attachedMedia.media.data);
      let arraybuffer = Uint8Array.from(bufferd).buffer;

      const image = new Blob([arraybuffer], {
        type: mediaType
      });
      const url = URL.createObjectURL(image);
      if (isPhoto) imageRef.current.src = url;
      else {   
        videoRef.current.src = url;
        let options = {
          rootMargin: "0px",
          threshold: 0.25
        };
        let handlePlay = (entries, observer) => {
          if (videoRef.current && !entries[0].isIntersecting && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        };
        let observer = new IntersectionObserver(handlePlay, options);
        observer.observe(videoRef.current);  
      }
    }
  });

  return (
    <>
      {attachedMedia && <div className="postImage">
        {isPhoto ? <img ref={imageRef} alt="" key={attachedMedia._id} /> :
          <video ref={videoRef} controls alt="" key={attachedMedia._id}/>
        }
        </div>
      }
    </>
  );
}

export default DynamicMedia;
