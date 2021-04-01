import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./Text.css";

const Text = ({ index }) => {
  const { posts } = useSelector(state => state.facebookPost);


  return (
    <>
      {posts[index] && posts[index].postMessage ?
        <div className="postBottom">
          <p>{posts[index].postMessage} {posts[index].link ? posts[index].link : ""}</p>
      </div>
      : null}
    </>
  );
}

export default Text;
