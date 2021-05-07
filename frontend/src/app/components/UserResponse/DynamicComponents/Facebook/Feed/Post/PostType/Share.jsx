import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Photo from './Photo';
import Video from './Video';
import Text from './Text';
import { Avatar } from "@material-ui/core";
import { selectSinglePost } from '../../../../../../../selectors/facebook';

const Share = ({ id }) => {
  const parentSharedPost = useSelector(state => selectSinglePost(state, id));
  const [renderSharePost, setRenderSharePost] = useState(null);

  useEffect(() => {
    if (parentSharedPost) {
      setRenderSharePost(
        <div className="post">
          <div className="postTop">
            <Avatar
              className="postTopAvatar"
            />
            <div className="postTopInfo">
              {/* <h3>{parentSharedPost.name}</h3>
              <p>{"2h"}</p> */}
            </div>
          </div>

          <Text className="postMessage" postMessage={parentSharedPost.postMessage} link={parentSharedPost.link} />

          {parentSharedPost.type === 'PHOTO' ?
            <Photo attachedMedia={parentSharedPost.attachedMedia[0]} />
            : null}

          {parentSharedPost.type === 'VIDEO' ?
            <Video attachedMedia={parentSharedPost.attachedMedia[0]} />
            : null}

          {parentSharedPost.type === 'LINK' ?
            <a href={parentSharedPost.link} className="link-preview" target="_blank" rel="noopener noreferrer">
              <div className="link-area">
                <div className="og-image">
                  <Photo attachedMedia={parentSharedPost.attachedMedia[0]} />
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
      {renderSharePost ? renderSharePost : null}
    </>
  );
}

export default Share;