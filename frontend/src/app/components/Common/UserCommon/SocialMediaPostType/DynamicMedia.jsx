import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import InfoIcon from '@material-ui/icons/Info';
import { Button } from "@material-ui/core";
import RenderRichTextArea from "../RenderRichTextArea";
import { trackUserClick } from "../../../../actions/userTracking";
import "./DynamicMedia.css";

const DynamicMedia = ({
    id,
    attachedMedia,
    customCSS,
    warningLabel,
    labelText,
    type,
    openModal,
    activateLink
  }) => {
  // we only handle cases for image and videos
  const [mediaType, setMediaType] = useState(attachedMedia ? attachedMedia.mimeType : null);
  const [isPhoto, setIsPhoto] = useState(attachedMedia ? attachedMedia.mimeType.indexOf('image') === -1 ? false : true : null);
  const [showWarningLabel, setShowWarningLabel] = useState(warningLabel === true);
  const [blur, setBlur] = useState(showWarningLabel);
  const imageRef = useRef(null);
  const videoRef = useRef(null);
  const dispatch = useDispatch();

  const removeBlurAndTrack = (e) => {
    e.preventDefault();
    setBlur(false);
    setShowWarningLabel(false);
    const track = {
      action: 'SEE' + type,
      userPostId: id
    };
    dispatch(trackUserClick(track));
    if (activateLink) activateLink(e);
  };

  function openSeeWhyModal(e) {
    e.preventDefault();
    if (openModal) openModal(e);
  }

  useEffect(() => {
    if (attachedMedia) {
      window.global = window;
      window.Buffer = window.Buffer || require('buffer').Buffer;  
      let bufferd = window.Buffer.from(attachedMedia.media.data);
      let arraybuffer = Uint8Array.from(bufferd).buffer;

      const image = new Blob([arraybuffer], {
        type: mediaType
      });
      const url = URL.createObjectURL(image);
      if (isPhoto) {
        imageRef.current.src = url;
      }
      else {
        videoRef.current.src = url;
        let options = {
          rootMargin: "0px",
          threshold: 0.25
        };
        let handlePlay = (entries, observer) => {
          if (videoRef.current && !entries[0].isIntersecting && !videoRef.current.paused) {
            videoRef.current.pause();
          }
        };
        let observer = new IntersectionObserver(handlePlay, options);
        observer.observe(videoRef.current);  
      }
    }
  }, []);

  return (
    <>
      {attachedMedia && (
        <div className="postImage">
          {isPhoto ? 
            <>
              <img
                ref={imageRef}
                alt=""
                className={customCSS ? `${customCSS}` : ''}
                key={attachedMedia._id}
                style={{
                  filter: blur ? 'blur(5rem)' : ''
                }}
              />
            </>
          : 
            <video
              ref={videoRef}
              controls
              alt=""
              className={customCSS ? `${customCSS}` : ''}
              key={attachedMedia._id}
              style={{
                filter: blur ? 'blur(5rem)' : ''
              }}
            />
          }
          {showWarningLabel && 
            <div className="mediaOverlay">
              <div>
                <InfoIcon fontSize="small" style={{
                  textAlign: "center",
                  color: 'white'
                }}
                />
                <RenderRichTextArea richText={labelText} inheritFontSize={false}/>
                <div className="mediaOverlayButtons">
                  <Button
                    onClick={e => openSeeWhyModal(e)}
                    variant="contained"
                    className="mediaOverlaySeeWhyButton"
                    >
                    See Why
                  </Button>
                  <Button
                    onClick={e => removeBlurAndTrack(e)}
                    className="mediaOverlaySeeButton"
                    variant="contained"
                    style={{
                      color: 'white',
                      backgroundColor: 'black'
                    }}
                  >
                    {"See " + (type ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase() : "Post")}
                  </Button>
                </div>
              </div>
            </div>
          }
        </div>
      )}
    </>
  );
}

export default DynamicMedia;
