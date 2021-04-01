import StoryReel from './StoryReel/StoryReel';
import StoryCreate from "./StoryCreate/StoryCreate";
import Post from './Post/Post';
// import { useSelector } from "react-redux";

const Feed = () => {
  // const { posts } = useSelector(state => state.facebookPost);
  // const { numPosts } = useSelector(state => state.facabookTotalPosts)

  return (
    <div className="feed">
      <StoryReel />
      <StoryCreate />
      {/* {posts && posts.length > 0 ? posts.map((post, index) => (
        <Post singlePost={post} index={index}/>
      ))
      : null} */}
      <Post />
    </div>
  );
};

export default Feed;