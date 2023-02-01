import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSinglePost } from '../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../selectors/socialMediaAuthors';
import "./ReplyTo.css"

const ReplyTo = ({ id }) => {
  const parentRepliedPost = useSelector(state => selectSinglePost(state, id));
  const [renderReplyPost, setRenderReplyPost] = useState(null);
  const singleAuthor = parentRepliedPost?.authorId ? useSelector(state => selectSocialMediaAuthor(state, parentRepliedPost.authorId)) : null;

  useEffect(() => {
    if (parentRepliedPost) {
      setRenderReplyPost(
        <div className="twitterReplyTo">
          Replying To <span>{singleAuthor?.handle || ""}</span>
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