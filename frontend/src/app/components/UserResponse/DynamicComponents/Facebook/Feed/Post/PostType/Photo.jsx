import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Photo.css";

const Photo = ({ index }) => {
  // const { posts } = useSelector(state => state.facebookPost);

  const { media } = useSelector(state => state.facebookMedia);

  const imageRef = useRef(null);
  
  useEffect(() =>{
    window.global = window;
    window.Buffer = window.Buffer || require('buffer').Buffer;
    // let bufferd = window.Buffer.from(posts[index].attachedMediaAdmin[0].media.data);
    if (media && media[index]?.length > 0) {

      let bufferd = window.Buffer.from(media[index][0].media.data);

      let arraybuffer = Uint8Array.from(bufferd).buffer;

      const image = new Blob([arraybuffer], {
        // type: posts[index].attachedMediaAdmin[0].mimeType
        type: media[index][0].mimeType
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
      {media && media[index]?.length > 0 ? <div className="postImage">
        {/* <img ref={imageRef} alt="" key={posts[index].attachedMediaAdmin[0]._id} /> */}
        <img ref={imageRef} alt="" key={media[index][0]._id} />
      </div> : null}
    </>
  );
}

export default Photo;