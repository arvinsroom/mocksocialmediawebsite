import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Photo.css";

const Photo = ({ attachedMedia }) => {
  // const { posts } = useSelector(state => state.facebookPost);
  // const { media } = useSelector(state => state.facebookMedia);

  const imageRef = useRef(null);
  
  useEffect(() =>{
    window.global = window;
    window.Buffer = window.Buffer || require('buffer').Buffer;
    // let bufferd = window.Buffer.from(posts[index].attachedMediaAdmin[0].media.data);
    if (attachedMedia) {

      let bufferd = window.Buffer.from(attachedMedia.media.data);

      let arraybuffer = Uint8Array.from(bufferd).buffer;

      const image = new Blob([arraybuffer], {
        // type: posts[index].attachedMediaAdmin[0].mimeType
        type: attachedMedia.mimeType
      });
      const url = URL.createObjectURL(image);
      
      // if ('srcObject' in imageRef.current) {
      //   imageRef.current.srcObject = url;
      // } else {
        imageRef.current.src = url;
      // }
    }
  });

  return (
    <>
      {attachedMedia ? <div className="postImage">
        {/* <img ref={imageRef} alt="" key={posts[index].attachedMediaAdmin[0]._id} /> */}
        <img ref={imageRef} alt="" key={attachedMedia._id} />
      </div> : null}
    </>
  );
}

export default Photo;