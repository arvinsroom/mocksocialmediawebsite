import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from './Link';
import Photo from './Photo';
import Video from './Video';
import Text from './Text';

const Share = ({ parentIndex }) => {
  const { posts } = useSelector(state => state.facebookPost);


  return (
    <>
    {posts[parentIndex].type === 'PHOTO' && posts[parentIndex].attachedMediaAdmin?.length > 0 ? 
      <Photo index={parentIndex} />
    : null}

    {posts[parentIndex].type === 'VIDEO' && posts[parentIndex].attachedMediaAdmin?.length > 0 ? 
      <Video index={parentIndex} />
    : null}

    {posts[parentIndex].type === 'LINK' && posts[parentIndex].attachedMediaAdmin?.length > 0 ?
      <Link index={parentIndex} />
    : null}

    {posts[parentIndex].type === 'TEXT' ?
      <Text index={parentIndex} />
    : null}
  </>
  );
}

export default Share;