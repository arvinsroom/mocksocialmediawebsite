import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSinglePost } from "../../../../../../../selectors/socialMedia";
import "./TikTokPost.css";
import TikTokVideo from "./TikTokVideo";

const TikTokPost = ({ id }) => {
  const [renderSinglePost, setRenderSinglePost] = useState(null);

  const singlePost = useSelector((state) => selectSinglePost(state, id));

  useEffect(() => {
    if (singlePost) {
      setRenderSinglePost(
        <>
          {singlePost.type === "VIDEO" && (
            <TikTokVideo
              mediaPath={
                singlePost.attachedMedia &&
                singlePost.attachedMedia[0]?.mediaPath
              }
              singlePost={singlePost}
            />
          )}
        </>
      );
    }
  }, [singlePost]);

  return (
    <div className="tiktokPost">
      {renderSinglePost ? renderSinglePost : null}
    </div>
  );
};

export default TikTokPost;
