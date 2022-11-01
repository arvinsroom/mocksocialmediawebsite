import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectSinglePost } from '../../../../../selectors/socialMedia';
import { trackLinkClick } from '../../../../../services/user-tracking-service';
import DynamicMedia from "../../SocialMediaPostType/DynamicMedia";

import "./DynamicLink.css";

const DynamicLink = ({ id }) => {
  const singlePost = useSelector(state => selectSinglePost(state, id));
  const [renderDynamicLink, setRenderDynamicLink] = useState(null);

  function storeLinkClick() {
    const track = {
      action: 'LINKCLICK',
      userPostId: id
    };
    trackLinkClick({ trackObj: track });
  }

  useEffect(() => {
    if (singlePost) {
      setRenderDynamicLink(
        <a href={singlePost.link} className="twitter-link-preview" onClick={storeLinkClick} target="_blank" rel="noopener noreferrer">
        {singlePost.attachedMedia[0] && (singlePost.linkTitle || singlePost.linkPreview) ?
          <>
            <DynamicMedia attachedMedia={singlePost.attachedMedia[0]} customCSS="twitterThreeSideBorder twitterCorrectMargin"/>
            <div className="twitterLinkThreeSideBorder twitterLinkCorrectMargin">
              <div className="twitter-og-title">
                {singlePost.linkTitle}
              </div>
              <div className="twitter-og-description">
                {singlePost.linkPreview}
              </div>
            </div>
          </>
          :
          <>
            {singlePost.attachedMedia[0] ?
              <DynamicMedia attachedMedia={singlePost.attachedMedia[0]} customCSS="twitterAllRoundBorder" />
              :
              (singlePost.linkTitle || singlePost.linkPreview) ?
                <div className="twitterLinkAllRoundBorder">
                  <div className="twitter-og-title">
                    {singlePost.linkTitle}
                  </div>
                  <div className="twitter-og-description">
                    {singlePost.linkPreview}
                  </div>
                </div>
                :
                null
            }
          </>
        }
      </a>  
      )
    }
  }, [id, singlePost]);


  return (
    <>
      {renderDynamicLink ? renderDynamicLink : null}
    </>
  )
};

export default DynamicLink;