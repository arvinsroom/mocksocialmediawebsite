import { useEffect, useRef, useState } from "react";
import "./DynamicMediaProfile.css";

const DynamicMediaProfile = ({ attachedMedia }) => {
  // we only handle cases for author image profile in this component
  const [mediaType, setMediaType] = useState(null);
  const [isPhoto, setIsPhoto] = useState(null);
  const imageRef = useRef(null);

  const updateState = async () => {
    await setMediaType(attachedMedia.mimeType);
    await setIsPhoto(attachedMedia.mimeType.indexOf('image') === -1 ? false : true);
  }

  useEffect(() => {
    if (attachedMedia) {
      updateState();
      window.global = window;
      window.Buffer = window.Buffer || require('buffer').Buffer;
      let bufferd = window.Buffer.from(attachedMedia.media.data);
      let arraybuffer = Uint8Array.from(bufferd).buffer;

      const image = new Blob([arraybuffer], {
        type: mediaType
      });
      const url = URL.createObjectURL(image);
      if (isPhoto) imageRef.current.src = url;

    }
  });

  return (
    <>
      {attachedMedia && <div className="author-profile-img-container">
        {isPhoto && <img ref={imageRef} key={attachedMedia._id} className="author-profile-img" />
        }
      </div>
      }
    </>
  );
}

export default DynamicMediaProfile;