import { useEffect, useRef, useCallback } from "react";
import PostTop from './Post/PostTop';
import { useSelector, useDispatch } from "react-redux";
import { selectAllPostIds } from '../../../../../selectors/facebook';
import PostBottom from "./Post/PostBottom";
import useStyles from '../../../../style';
import {
  getFacebookPosts
} from "../../../../../actions/facebook";
import Progress from '../../../../Progress';

const Feed = () => {
  const allIds = useSelector(state => selectAllPostIds(state));
  const currentPostPage = useSelector(state => state.facebook.currentPostPage);
  const isLoading = useSelector(state => state.facebook.isLoading);
  const postEachPage = useSelector(state => state.facebook.postEachPage);
  const totalPostIds = useSelector(state => state.facebook.totalPostIds);
  const finish = useSelector(state => state.facebook.finish);

  const classes = useStyles();
  const dispatch = useDispatch();
  const observer = useRef();

  useEffect(() => {
    if (!finish) {
      const startIndex = currentPostPage * postEachPage;
      const slicePosts = totalPostIds.slice(startIndex, startIndex+5);
      dispatch(getFacebookPosts({ postIds: slicePosts }));
    }
  }, []);

  const lastPostRef = useCallback(node => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !finish) {
        const startIndex = currentPostPage * postEachPage;
        const slicePosts = totalPostIds.slice(startIndex, startIndex+5);
        dispatch(getFacebookPosts({ postIds: slicePosts }))
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, finish, currentPostPage, postEachPage, totalPostIds, dispatch])

  return (
    <div className={classes.feed}>
      {isLoading && <Progress />}
      {allIds.map((postId, index) => {
        if (allIds.length === index + 1) {
          return (<div key={postId} ref={lastPostRef} className={classes.post}>
            <PostTop id={postId}/>
            <PostBottom id={postId} />
          </div>)
        } else {
          return (<div key={postId} className={classes.post}>
            <PostTop id={postId}/>
            <PostBottom id={postId} />
          </div>)
        }
      })}
    </div>
  );
};

export default Feed;