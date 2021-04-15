import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Video.css";

const Video = ({ attachedMedia }) => {
    // const singlePost = useSelector(state => selectSubItems(state, id));

  // const { posts } = useSelector(state => state.facebookPost);

  // const { media } = useSelector(state => state.facebookMedia);

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
    if (attachedMedia) {
      let bufferd = window.Buffer.from(attachedMedia.media.data);
      let arraybuffer = Uint8Array.from(bufferd).buffer;

      const image = new Blob([arraybuffer], {
        // type: posts[index].attachedMediaAdmin[0].mimeType
        type: attachedMedia.mimeType
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
    {attachedMedia && <div className="postImage">
      {/* <video ref={videoRef} controls alt="" key={posts[index].attachedMediaAdmin[0]._id} /> */}
      <video ref={videoRef} controls alt="" key={attachedMedia._id} />
    </div>}
    </>
  );
}

export default Video;
