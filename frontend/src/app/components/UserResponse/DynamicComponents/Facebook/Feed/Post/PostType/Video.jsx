import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Video.css";

const Video = ({ index }) => {
  // const { posts } = useSelector(state => state.facebookPost);

  const { media } = useSelector(state => state.facebookMedia);

  const videoRef = useRef(null);

  // method 1
  // function toArrayBuffer(buf) {
  //   var ab = new ArrayBuffer(buf.length);
  //   var view = new Uint8Array(ab);
  //   for (var i = 0; i < buf.length; ++i) {
  //       view[i] = buf[i];
  //   }
  //   return ab;
  // }
  // const image = new Blob([toArrayBuffer(buffer.thumbnail.data)], {
  //   type: 'image/jpg'
  // });

  // Method 2
  // window.global = window;
  // window.Buffer = window.Buffer || require('buffer').Buffer;
  // let bufferd = window.Buffer.from(buffer.thumbnail.data);
  // let arraybuffer = Uint8Array.from(bufferd).buffer;

  // const image = new Blob([arraybuffer], {
  //   type: 'image/jpg'
  // });


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
      
      // if ('srcObject' in videoRef.current) {
        // videoRef.current.srcObject = url;
      // } else {
      videoRef.current.src = url;
      // }
    }
  });

  return (
    <>
    {media &&  media[index]?.length > 0 ? <div className="postImage">
      {/* <video ref={videoRef} controls alt="" key={posts[index].attachedMediaAdmin[0]._id} /> */}
      <video ref={videoRef} controls alt="" key={media[index][0]._id} />
    </div> : null}
    </>
  );
}

export default Video;
