import { useEffect, useRef } from "react";
import "./Photo.css";

const Photo = ({ attachedMedia }) => {
  const imageRef = useRef(null);
  
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
      imageRef.current.src = url;
    }
  });

  return (
    <>
      {attachedMedia ? <div className="postImage">
        <img ref={imageRef} alt="" key={attachedMedia._id} />
      </div> : null}
    </>
  );
}

export default Photo;