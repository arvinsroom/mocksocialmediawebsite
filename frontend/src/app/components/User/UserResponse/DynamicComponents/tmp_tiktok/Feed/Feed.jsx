import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTikTokPosts } from "../../../../../../actions/socialMedia";
import { selectAllPostIds } from "../../../../../../selectors/socialMedia";
import Progress from "../../../../../Common/Progress";
import "./Feed.css";
import TikTokPost from "./TikTokPost/TikTokPost";

const Feed = () => {
  const allIds = useSelector((state) => selectAllPostIds(state));
  const currentPostPage = useSelector(
    (state) => state.socialMedia.currentPostPage
  );
  const isLoading = useSelector((state) => state.socialMedia.isLoading);
  const postEachPage = useSelector((state) => state.socialMedia.postEachPage);
  const totalPostIds = useSelector((state) => state.socialMedia.totalPostIds);
  const finish = useSelector((state) => state.socialMedia.finish);

  const dispatch = useDispatch();
  const observer = useRef();

  useEffect(() => {
    if (!finish) {
      const startIndex = currentPostPage * postEachPage;
      const slicePosts = totalPostIds.slice(startIndex, startIndex + 5);
      dispatch(getTikTokPosts({ postIds: slicePosts }));
    }
  }, []);

  const lastPostRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !finish) {
          const startIndex = currentPostPage * postEachPage;
          const slicePosts = totalPostIds.slice(startIndex, startIndex + 5);
          dispatch(getTikTokPosts({ postIds: slicePosts }));
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, finish, currentPostPage, postEachPage, totalPostIds, dispatch]
  );

  // allIds represent the current length of ids start from 5 and at the 5th node
  // we add a lastPostRef so that when we reach near that ref i.e. post we fetch new posts
  return (
    <>
      <div className="tiktokFeedMain">
        {allIds.map((postId, index) => {
          if (allIds.length === index + 1) {
            return (
              <div key={index} ref={lastPostRef}>
                <TikTokPost id={postId} />
              </div>
            );
          } else {
            return (
              <div key={index}>
                <TikTokPost id={postId} />
              </div>
            );
          }
        })}
      </div>
      <div className="paddingTop">{isLoading && <Progress />}</div>
    </>
  );
};

export default Feed;
