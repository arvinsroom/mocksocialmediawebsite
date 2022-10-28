import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSinglePost } from '../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../selectors/socialMediaAuthors';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';

import "./PostHeaderDisplay.css";

const PostHeaderDisplay = ({ id }) => {
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const singlePost = useSelector(state => selectSinglePost(state, id));
  const singleAuthor = singlePost?.authorId ? useSelector(state => selectSocialMediaAuthor(state, singlePost.authorId)) : null;
  const [renderDynamicHeader, setRenderDynamicHeader] = useState(null);

  function parseUserName() {
    if (userRegisterData['USERNAME']) {
      if (userRegisterData['USERNAME'].length > 32) {
        return userRegisterData['USERNAME'].substr(0, 32) + "...";
      } else {
        return userRegisterData['USERNAME'];
      }
    } else {
      return "";
    }
  }

  useEffect(() => {
    if (singlePost) {
      setRenderDynamicHeader(
        <>
          <h3 className="dynamicPostHeaderInfo">
            {/* username from registration page */}
            {singlePost.userPost ? (parseUserName()) : 
              singleAuthor?.authorName || ""
            }
          </h3>
          
          {singleAuthor?.authorVerified ? 
          <>
            <VerifiedUserIcon className="dynamicPostBadge" />
          </> : null}
        
          <span className="dynamicPostHeaderHandle">
            {singlePost.userPost ? 
            <div>
              {userRegisterData['HANDLE'] || ""}
              <span>&#183;</span>
            </div> : 
            <div>
              {singleAuthor?.handle  || ""}
              <span>&#183;</span>
            </div>}
          </span>

          <span className="dynamicPostHeaderTime">
            {singlePost.isReplyTo !== null && singlePost.userPost === true ? "2s" : singlePost.datePosted || ""}
          </span>
        </>
      )
    }
  }, [id, singlePost]);

  return (
    <>
      {renderDynamicHeader ? renderDynamicHeader : null}
    </>
  );
}

export default PostHeaderDisplay;