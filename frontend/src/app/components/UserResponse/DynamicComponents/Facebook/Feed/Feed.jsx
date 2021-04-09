// import StoryReel from './StoryReel/StoryReel';
import StoryCreate from "./StoryCreate/StoryCreate";
import PostT from './Post/PostT';
// import { useSelector } from "react-redux";
import { useSelector } from "react-redux";
import { createSelector } from 'reselect'
import { selectSubIds } from '../../../../../reducers/facebook';
import PostBottom from "./Post/PostBottom";
import useStyles from '../../../../style';

// const selectPosts = state => state.facebookPost.posts;

// export const postById = createCachedSelector(
//   // inputSelectors
//   state => state.facebookPost.posts, 
//   // resultFunc
//   (allposts, postId) => {
//     return allposts.byId[postId];
//   }
// )(
  // re-reselect keySelector (receives selectors' arguments)
  // Use "libraryName" as cacheKey
//   (_state_, singlePost) => singlePost
// );

const Feed = () => {
  const allIds = useSelector(state => selectSubIds(state));
  const classes = useStyles();

  // console.log('singlsePost: ', singlsePost);
  // get all the postIds and then have them cached using that postId
  // const allPostIds = useSelector(state => state.facebookPost.posts.allIds);

  // export const selectAllPosts = ;
  // export const selectPostById = (state, postId) => state.facebookPost.posts.byId[postId];
  // const { posts } = useSelector(state => state.facebookPost); // { "0" : {}, "1": {}}
  // const { allIds } = useSelector(state => state.facebookPost); // [0, 1...]
  // const allIds = useSelector(state => selectEachPost(state));

  // function selectPosts () { return posts; }
  // function selectIds () { return allIds; }

  // const selectSubosts = createSelector(
  //   selectPosts,
  //   (posts) => {
  //     if (posts) {
  //       const ids = Object.keys(posts);
  //       return ids.map(id => <PostT singlePost={posts[id]} />);
  //     }
  //   }
  // );


  // const getALLL = () => {
  //   if (allIds) {
  //     for (let i = 0; allIds.length; i++) {
        
  //       return <PostT singlePost={eachPost} />;;
  //     }
  //   }
  // }

  // const singlePost = useSelector(state => selectSubItems(state));

  return (
    <div className={classes.feed}>
      {/* <StoryReel /> */}
      <StoryCreate />
      {/* <PostT /> */}
      {/* {selectSubosts()} */}
      {allIds && allIds.map(postId => (
        <div key={postId} className={classes.post}>
          <PostT id={postId}/>
          <PostBottom id={postId} />
        </div>
      ))}
      {/* {singlsePost?.length > 0 && singlsePost.map(singlePost => ( */}
        {/* <PostT id={106} />
        <PostT id={517} />
        <PostT id={518} /> */}

      {/* ))} */}
    </div>
  );
};

export default Feed;