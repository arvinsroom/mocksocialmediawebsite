import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectSinglePost } from '../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../selectors/socialMediaAuthors';

const ReplyTo = ({ id }) => {
  const parentRepliedPost = useSelector(state => selectSinglePost(state, id));
  const [renderReplyPost, setRenderReplyPost] = useState(null);
  const singleAuthor = useSelector(state => selectSocialMediaAuthor(state, parentRepliedPost.authorId));

  useEffect(() => {
    if (parentRepliedPost) {
      setRenderReplyPost(
        <div className="twitterReplyTo">
          Replying To {singleAuthor.handle || ""}
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