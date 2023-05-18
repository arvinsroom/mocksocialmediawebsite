import { useEffect, useRef, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getTwitterPosts,
} from '../../../../../../actions/socialMedia';
import TwitterPostBottom from "./TwitterPost/TwitterPostBottom";
import TwitterPostTop from './TwitterPost/TwitterPostTop';
import Progress from '../../../../../Common/Progress';
import "./Feed.css";

const Feed = ({ omitInteractionBar }) => {
  const currentPostPage = useSelector(state => state.socialMedia.currentPostPage);
  const isLoading = useSelector(state => state.socialMedia.isLoading);
  const postEachPage = useSelector(state => state.socialMedia.postEachPage);
  const totalPostIds = useSelector(state => state.socialMedia.totalPostIds);
  const finish = useSelector(state => state.socialMedia.finish);
  const storedPosts = useSelector(state => state.socialMedia.posts);
  const [postToRender, setPostToRender] = useState([]);
  const dispatch = useDispatch();
  const observer = useRef();

  useEffect(() => {
    //Handle and sort by type the posts that will be displayed
    //final result variale will contain the result to later be stored in the created state postsToRender
    const finalResult = [];
    //we start by looping in all the posts that we get from db
    for (let post in storedPosts) {
      const result = {
        _id: storedPosts[post]._id,
        adminPostId: storedPosts[post].adminPostId,
        replies: []
      };
      // if any storedPosts is a user post just send it to the top we always want it there
      if (storedPosts[post].userPost === true) {
        finalResult.push(result);
        continue;
      }
      //we store all the posts that are not replays in result obj
      if (storedPosts[post].isReplyTo === null) {
        //for each post that is not a REPLYTO, we loop to see if there is REPLYTO  contains an id of the post as parentPostId
        for (let item in storedPosts) {
          if (storedPosts[item].isReplyTo !== null && storedPosts[item].parentPostId === storedPosts[post]._id
            && storedPosts[item].userPost === false) {
            const reply = {
              _id: storedPosts[item]._id,
              parentPostId: storedPosts[post]._id,
            }
            result.replies.push(reply);
          }
        }
        finalResult.push(result);
      }
    }
    //we save all results in a state that later will used to render posts, its replay and their replays
    setPostToRender(finalResult);
  }, [storedPosts]);

  useEffect(() => {
    if (!finish) {
      const startIndex = currentPostPage * postEachPage;
      // TODO: modify later and implement lazy loading at the end 40 -> 5
      const slicePosts = totalPostIds.slice(startIndex, startIndex+5);

      dispatch(getTwitterPosts({ postIds: slicePosts }));
    }
  }, []);

  const lastPostRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !finish) {
        const startIndex = currentPostPage * postEachPage;
        const slicePosts = totalPostIds.slice(startIndex, startIndex+5);
        dispatch(getTwitterPosts({ postIds: slicePosts }))
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, finish, currentPostPage, postEachPage, totalPostIds, dispatch])

  // allIds represent the current length of ids start from 5 and at the 5th node
  // we add a lastPostRef so that when we reach near that ref i.e. post we fetch new posts
  return (
    <>
      <div className="twitterFeedMain">
      {
        postToRender.length > 0 && postToRender.map((post, index) => {
          // first we save all the replies in an array 
          // note they are not rendered yet
          const replies = post.replies.map((reply, replyIndex) => (
            <div key={reply._id} ref={post?.replies?.length === replyIndex + 1 ? lastPostRef : null}
              className="twitterRepliesPost hoverEffect">
              <TwitterPostTop id={reply._id} />
              <TwitterPostBottom id={reply._id} />
            </div>
          ));
          // show all the replies right here
          return (
            <div key={post._id} ref={postToRender?.length === index + 1 ? lastPostRef : null} className="twitterPostCard hoverEffect">
              <TwitterPostTop id={post._id} />
              {!omitInteractionBar && <TwitterPostBottom id={post._id} /> }
              {replies}
            </div>
          )
        })
      }
      </div>
      <div className="paddingTop">
        {isLoading && <Progress />}
      </div>
    </>
  );
}

export default Feed;