import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSinglePost } from '../../../../../../../../selectors/facebook';

const ReplyTo = ({ id }) => {
  const parentRepliedPost = useSelector(state => selectSinglePost(state, id));
  const [renderReplyPost, setRenderReplyPost] = useState(null);

  useEffect(() => {
    if (parentRepliedPost) {
      setRenderReplyPost(
        <div className="twitterReplyTo">
          Replying To {parentRepliedPost.handle || ""}
        </div>
      );
    }
  }, [parentRepliedPost])

  return (
    <>
      {renderReplyPost ? renderReplyPost : null}
    </>
  );
}

export default ReplyTo;