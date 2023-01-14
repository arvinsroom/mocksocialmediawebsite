import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSinglePost } from '../../../../../selectors/socialMedia';
import { selectSocialMediaAuthor } from '../../../../../selectors/socialMediaAuthors';
import VerifiedIcon from '../../../../../../assets/Twitter/verified-icon.svg';
import { parseUserRegisterName } from '../../../../../utils';
import "./PostHeaderDisplay.css";

const PostHeaderDisplay = ({ id }) => {
  const userRegisterData = useSelector(state => state.userRegister.metaData);
  const singlePost = useSelector(state => selectSinglePost(state, id));
  const singleAuthor = singlePost?.authorId ? useSelector(state => selectSocialMediaAuthor(state, singlePost.authorId)) : null;
  const [renderDynamicHeader, setRenderDynamicHeader] = useState(null);

  useEffect(() => {
    if (singlePost) {
      setRenderDynamicHeader(
        <>
          <div className="dynamicPostHeaderInfo">
            {/* username from registration page */}
            {singlePost.userPost ? (parseUserRegisterName(userRegisterData)) : 
              singleAuthor?.authorName || ""
            }
          </div>
          
          {singleAuthor?.authorVerified ? 
          <>
            <VerifiedIcon className="dynamicPostBadge"/>
          </> : null}
        
          <span className="dynamicPostHeaderHandle">
            {singlePost.userPost ? 
            <div>
              {userRegisterData['HANDLE'] || null}
            </div> : 
            <div>
              {singleAuthor?.handle  || null}
            </div>}
          </span>

          <span className="dynamicPostHeaderTime">
            {singlePost.isReplyTo !== null && singlePost.userPost === true ? 
            <div>
              <span>&#183;</span>
              {"2s"}
            </div> : 
            singlePost.datePosted ?
            <div>
              <span>&#183;</span>
              {singlePost.datePosted}
            </div>
            : null}
          </span>
        </>
      )
    }
  }, [id, singlePost, singleAuthor]);

  return (
    <>
      {renderDynamicHeader ? renderDynamicHeader : null}
    </>
  );
}

export default PostHeaderDisplay;