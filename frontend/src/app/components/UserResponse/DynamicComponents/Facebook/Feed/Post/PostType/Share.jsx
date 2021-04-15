import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Link from './Link';
import Photo from './Photo';
import Video from './Video';
import Text from './Text';
import { Avatar } from "@material-ui/core";
import { shallowEqual } from "react-redux";
import { selectSubItems, selectAllLikes } from '../../../../../../../reducers/facebook';

const Share = ({ id }) => {
  const parentSharedPost = useSelector(state => selectSubItems(state, id));
  // const clusters = useSelector((state) => state.clusters?.data?.clusters ?? [], shallowEqual);
  const [ss, setSs] = useState(null);

  useEffect(()=> {
    if (parentSharedPost) {
    setSs(
    <div className="post">
        <div className="postTop">
          <Avatar
          className="postTopAvatar"
          />
          <div className="postTopInfo">
            <h3>{parentSharedPost.name}</h3>
            <p>{"2h"}</p>
          </div>
        </div>

        <Text className="postMessage" postMessage={parentSharedPost.postMessage} link={parentSharedPost.link}/>

        {parentSharedPost.type === 'PHOTO' ?
          <Photo attachedMedia={parentSharedPost.attachedMediaAdmin[0]} />
        : null}

        {parentSharedPost.type === 'VIDEO' ?
          <Video attachedMedia={parentSharedPost.attachedMediaAdmin[0]} />
        : null}

        {parentSharedPost.type === 'LINK' ?
        <a href={parentSharedPost.link} className="link-preview" target="_blank" rel="noopener noreferrer">
          <div className="link-area">
            <div className="og-image">
              <Photo attachedMedia={parentSharedPost.attachedMediaAdmin[0]} />
            </div>
            <div className="descriptions">
              <div className="og-title">
                {parentSharedPost.linkTitle}
              </div>
              <div className="og-description">
                {parentSharedPost.linkPreview}
              </div>
            </div>
          </div>
        </a>
        : null}
    </div>
    );
    }
  }, [parentSharedPost])

  return (
    <>
          {ss ? ss : null}

  </>
  );
}

export default Share;